import React, { useState, useEffect, useRef } from "react";
import "../../../common/input-group.css";
import "../../../common/table.css";
import { toast, Id } from "react-toastify";
import MaintainClassesResults from "./MaintainClassesResults";
import { FormikHelpers } from "formik";
import { displayErrorToast, updateToast } from "../../../common/toastHelpers";
import cardServiceImpl from "../../../services/CardService";
import { useFormik } from "formik";
import { heroClassSchema } from "../../../schemas/index";
import type { HeroClass } from "../../../dto/HeroClass";
import { usePagination } from "../../../common/pagination/usePagination";
import PaginationControls from "../../../common/pagination/PaginationControls";
import EditRecordModal from "../../../common/EditRecordModal";

interface FormValues {
  name: string;
}

interface MaintainClassesProps {
  cardService?: typeof cardServiceImpl;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

export default function MaintainClasses({
  cardService = cardServiceImpl,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
}: MaintainClassesProps) {
  const [heroClasses, setHeroClasses] = useState<HeroClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingHeroClass, setEditingHeroClass] = useState<HeroClass | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const addToastRef = useRef<Id | null>(null);
  const deleteToastRef = useRef<Id | null>(null);
  const updateToastRef = useRef<Id | null>(null);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: heroClassSchema,
    onSubmit,
  });

  const editFormik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      name: editingHeroClass?.name ?? "",
    },
    validationSchema: heroClassSchema,
    onSubmit: (formValues, actions) => updateHeroClass(formValues, actions),
  });

  const pagination = usePagination({
    items: heroClasses,
    initialPageSize,
  });

  useEffect(() => {
    fetchHeroClasses();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(values: FormValues, actions: FormikHelpers<FormValues>) {
    addHeroClass(values, actions);
  }

  async function fetchHeroClasses() {
    setIsLoading(true);
    const { data, error } = await cardService.fetchHeroClasses();

    if (error == null) {
      setHeroClasses(data as HeroClass[]);
      setIsLoading(false);
    } else {
      displayErrorToast(error);
    }
  }

  async function addHeroClass(values: FormValues, actions: FormikHelpers<FormValues>) {
    addToastRef.current = toast("Adding record...");

    const { error } = await cardService.addHeroClass({
      ...values,
      id: 0, // temporary id, will be replaced by server
      created_at: new Date().toISOString(),
    });

    updateToast(addToastRef, error, true);

    if (error == null) {
      actions.resetForm();
      fetchHeroClasses();
    }
  }

  async function deleteHeroClass(e: React.MouseEvent<SVGSVGElement>) {
    deleteToastRef.current = toast("Deleting record...");
    const { error } = await cardService.deleteHeroClass(Number(e.currentTarget.id));
    updateToast(deleteToastRef, error, true);

    if (error == null) {
      fetchHeroClasses();
    }
  }

  const openEditModal = (heroClass: HeroClass) => {
    setEditingHeroClass(heroClass);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    if (isUpdating) return;
    setIsEditModalOpen(false);
    editFormik.resetForm();
    setEditingHeroClass(null);
  };

  async function updateHeroClass(values: FormValues, actions: FormikHelpers<FormValues>) {
    if (!editingHeroClass) return;
    setIsUpdating(true);
    updateToastRef.current = toast("Updating record...");

    const { error } = await cardService.updateHeroClass(editingHeroClass.id, values);
    updateToast(updateToastRef, error, true, "Record updated");

    if (error == null) {
      actions.resetForm();
      setIsEditModalOpen(false);
      setEditingHeroClass(null);
      fetchHeroClasses();
    }

    setIsUpdating(false);
  }

  return (
    <div className="maintain-data">
      <div className="input-group">
        <form onSubmit={handleSubmit} role="form">
          <div className="form-control">
            <label htmlFor="name">Name</label>
            <input
              placeholder="Name"
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.name && touched.name ? "error" : ""}
            />
            {errors.name && touched.name && <div className="error-msg">{errors.name}</div>}
          </div>
          <input type="submit" value="Submit" className="submit-align-bottom" />
        </form>
      </div>

      <MaintainClassesResults
        isLoading={isLoading}
        heroClasses={pagination.pagedItems}
        deleteHeroClass={deleteHeroClass}
        onSelectHeroClass={openEditModal}
      />
      {!isLoading && (
        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          startItem={pagination.startItem}
          endItem={pagination.endItem}
          pageSize={pagination.pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageChange={pagination.setPage}
          onPageSizeChange={pagination.setPageSize}
        />
      )}

      <EditRecordModal
        isOpen={isEditModalOpen}
        title="Edit Hero Class"
        onCancel={closeEditModal}
        onSave={editFormik.submitForm}
        isSaving={isUpdating}
      >
        <form onSubmit={editFormik.handleSubmit} role="form" data-testid="edit-class-form">
          <div className="form-control">
            <label htmlFor="edit-class-name">Name</label>
            <div className="input-container">
              <input
                id="edit-class-name"
                name="name"
                type="text"
                placeholder="Name"
                value={editFormik.values.name}
                onChange={editFormik.handleChange}
                onBlur={editFormik.handleBlur}
                className={editFormik.errors.name && editFormik.touched.name ? "error" : ""}
              />
              {editFormik.errors.name && editFormik.touched.name && (
                <div className="error-msg">{editFormik.errors.name}</div>
              )}
            </div>
          </div>
        </form>
      </EditRecordModal>
    </div>
  );
}
