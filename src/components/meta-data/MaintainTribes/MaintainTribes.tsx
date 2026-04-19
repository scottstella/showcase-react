import React, { useState, useEffect, useRef } from "react";
import "../../../common/input-group.css";
import "../../../common/table.css";
import { toast, Id } from "react-toastify";
import MaintainTribesResults from "./MaintainTribesResults";
import { displayErrorToast, updateToast } from "../../../common/toastHelpers";
import cardServiceImpl from "../../../services/CardService";
import { useFormik, FormikHelpers } from "formik";
import { tribeSchema } from "../../../schemas/index";
import type { Tribe } from "../../../dto/Tribe";
import { usePagination } from "../../../common/pagination/usePagination";
import PaginationControls from "../../../common/pagination/PaginationControls";
import EditRecordModal from "../../../common/EditRecordModal";

interface FormValues {
  name: string;
}

export default function MaintainTribes({
  cardService = cardServiceImpl,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
}: {
  cardService?: typeof cardServiceImpl;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}) {
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTribe, setEditingTribe] = useState<Tribe | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const addToastRef = useRef<Id | null>(null);
  const deleteToastRef = useRef<Id | null>(null);
  const updateToastRef = useRef<Id | null>(null);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik<FormValues>(
    {
      initialValues: {
        name: "",
      },
      validationSchema: tribeSchema,
      onSubmit,
    }
  );

  const editFormik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      name: editingTribe?.name ?? "",
    },
    validationSchema: tribeSchema,
    onSubmit: (formValues, actions) => updateTribe(formValues, actions),
  });

  const pagination = usePagination({
    items: tribes,
    initialPageSize,
  });

  useEffect(() => {
    fetchTribes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(values: FormValues, actions: FormikHelpers<FormValues>) {
    addTribe(values, actions);
  }

  async function fetchTribes() {
    setIsLoading(true);
    try {
      const { data, error } = await cardService.fetchTribes();

      if (error == null) {
        setTribes(data as Tribe[]);
      } else {
        displayErrorToast(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function addTribe(values: FormValues, actions: FormikHelpers<FormValues>) {
    addToastRef.current = toast("Adding record...");

    const { error } = await cardService.addTribe({
      ...values,
      id: 0, // temporary id, will be replaced by server
      created_at: new Date().toISOString(),
    });

    updateToast(addToastRef, error, true);

    if (error == null) {
      actions.resetForm();
      fetchTribes();
    }
  }

  async function deleteTribe(e: React.MouseEvent<SVGSVGElement>) {
    deleteToastRef.current = toast("Deleting record...");
    const { error } = await cardService.deleteTribe(Number(e.currentTarget.id));
    updateToast(deleteToastRef, error, true);

    if (error == null) {
      fetchTribes();
    }
  }

  const openEditModal = (tribe: Tribe) => {
    setEditingTribe(tribe);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    if (isUpdating) return;
    setIsEditModalOpen(false);
    editFormik.resetForm();
    setEditingTribe(null);
  };

  async function updateTribe(values: FormValues, actions: FormikHelpers<FormValues>) {
    if (!editingTribe) return;
    setIsUpdating(true);
    updateToastRef.current = toast("Updating record...");

    const { error } = await cardService.updateTribe(editingTribe.id, values);
    updateToast(updateToastRef, error, true, "Record updated");

    if (error == null) {
      actions.resetForm();
      setIsEditModalOpen(false);
      setEditingTribe(null);
      fetchTribes();
    }

    setIsUpdating(false);
  }

  return (
    <div className="maintain-data">
      <div className="input-group">
        <form onSubmit={handleSubmit} role="form">
          <div className="form-control">
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
          <input type="submit" value="Submit" />
        </form>
      </div>

      <MaintainTribesResults
        isLoading={isLoading}
        tribes={pagination.pagedItems}
        deleteTribe={deleteTribe}
        onSelectTribe={openEditModal}
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
        title="Edit Tribe"
        onCancel={closeEditModal}
        onSave={editFormik.submitForm}
        isSaving={isUpdating}
      >
        <form onSubmit={editFormik.handleSubmit} role="form" data-testid="edit-tribe-form">
          <div className="form-control">
            <label htmlFor="edit-tribe-name">Name</label>
            <div className="input-container">
              <input
                id="edit-tribe-name"
                name="name"
                type="text"
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
