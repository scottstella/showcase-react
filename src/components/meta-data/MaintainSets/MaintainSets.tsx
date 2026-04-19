import React, { useState, useEffect, useRef } from "react";
import "../../../common/input-group.css";
import "../../../common/table.css";
import { toast, Id } from "react-toastify";
import MaintainSetsResults from "./MaintainSetsResults";
import { displayErrorToast, updateToast } from "../../../common/toastHelpers";
import cardServiceImpl from "../../../services/CardService";
import { useFormik, FormikHelpers } from "formik";
import { setSchema } from "../../../schemas/index";
import type { Set } from "../../../dto/Set";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { usePagination } from "../../../common/pagination/usePagination";
import PaginationControls from "../../../common/pagination/PaginationControls";
import EditRecordModal from "../../../common/EditRecordModal";
import "./MaintainSets.css";

interface FormValues {
  name: string;
  is_standard: boolean;
  release_date: string;
}

interface MaintainSetsProps {
  cardService?: typeof cardServiceImpl;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

export default function MaintainSets({
  cardService = cardServiceImpl,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
}: MaintainSetsProps) {
  const [sets, setSets] = useState<Set[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSet, setEditingSet] = useState<Set | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const editDateInputRef = useRef<HTMLInputElement>(null);

  const addToastRef = useRef<Id | null>(null);
  const deleteToastRef = useRef<Id | null>(null);
  const updateToastRef = useRef<Id | null>(null);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik<FormValues>(
    {
      initialValues: {
        name: "",
        is_standard: false,
        release_date: new Date().toISOString().split("T")[0], // Default to today's date
      },
      validationSchema: setSchema,
      onSubmit,
    }
  );

  const pagination = usePagination({
    items: sets,
    initialPageSize,
  });

  useEffect(() => {
    fetchSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(values: FormValues, actions: FormikHelpers<FormValues>) {
    addSet(values, actions);
  }

  const editFormik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      name: editingSet?.name ?? "",
      is_standard: editingSet?.is_standard ?? false,
      release_date: editingSet?.release_date ?? new Date().toISOString().split("T")[0],
    },
    validationSchema: setSchema,
    onSubmit: (values, actions) => updateSet(values, actions),
  });

  async function fetchSets() {
    setIsLoading(true);
    const { data, error } = await cardService.fetchSets();

    if (error == null) {
      setSets(data as Set[]);
      setIsLoading(false);
    } else {
      displayErrorToast(error);
    }
  }

  async function addSet(values: FormValues, actions: FormikHelpers<FormValues>) {
    addToastRef.current = toast("Adding record...");

    const { error } = await cardService.addSet({
      ...values,
      created_at: new Date().toISOString(),
    } as Set);

    updateToast(addToastRef, error, true);

    if (error == null) {
      actions.resetForm();
      fetchSets();
    }
  }

  async function deleteSet(e: React.MouseEvent<SVGSVGElement>) {
    deleteToastRef.current = toast("Deleting record...");
    const { error } = await cardService.deleteSet(Number(e.currentTarget.id));
    updateToast(deleteToastRef, error, true);

    if (error == null) {
      fetchSets();
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    // Blur the input to close the picker after selection
    e.target.blur();
  };

  const handleEditDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    editFormik.handleChange(e);
    e.target.blur();
  };

  const openEditModal = (set: Set) => {
    setEditingSet(set);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    if (isUpdating) return;
    setIsEditModalOpen(false);
    editFormik.resetForm();
    setEditingSet(null);
  };

  async function updateSet(values: FormValues, actions: FormikHelpers<FormValues>) {
    if (!editingSet) return;
    setIsUpdating(true);
    updateToastRef.current = toast("Updating record...");

    const { error } = await cardService.updateSet(editingSet.id, values);
    updateToast(updateToastRef, error, true, "Record updated");

    if (error == null) {
      actions.resetForm();
      setIsEditModalOpen(false);
      setEditingSet(null);
      fetchSets();
    }

    setIsUpdating(false);
  }

  return (
    <div className="maintain-data">
      <div className="input-group">
        <form onSubmit={handleSubmit} role="form">
          <div className="form-row">
            <div>
              <div className="form-control">
                <label htmlFor="name">Name</label>
                <div className="input-container">
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
              </div>

              <div className="checkbox-control">
                <label>
                  <input
                    type="checkbox"
                    id="is_standard"
                    name="is_standard"
                    checked={values.is_standard}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  Standard Set
                </label>
              </div>
            </div>

            <div className="form-control date-control">
              <label htmlFor="release_date">Release Date</label>
              <div className="input-container">
                <input
                  ref={dateInputRef}
                  type="date"
                  id="release_date"
                  name="release_date"
                  value={values.release_date}
                  onChange={handleDateChange}
                  onBlur={handleBlur}
                  className={errors.release_date && touched.release_date ? "error" : ""}
                />
                <div className="icon-container">
                  <FontAwesomeIcon icon={faCalendar} className="date-picker-icon" />
                </div>
                {errors.release_date && touched.release_date && (
                  <div className="error-msg">{errors.release_date}</div>
                )}
              </div>
            </div>

            <input type="submit" value="Submit" className="submit-button" />
          </div>
        </form>
      </div>

      <MaintainSetsResults
        isLoading={isLoading}
        sets={pagination.pagedItems}
        deleteSet={deleteSet}
        onSelectSet={openEditModal}
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
        title="Edit Set"
        onCancel={closeEditModal}
        onSave={editFormik.submitForm}
        isSaving={isUpdating}
      >
        <form
          className="edit-set-form"
          onSubmit={editFormik.handleSubmit}
          role="form"
          data-testid="edit-set-form"
        >
          <div className="form-control">
            <label htmlFor="edit-name">Name</label>
            <div className="input-container">
              <input
                id="edit-name"
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

          <div className="checkbox-control edit-set-checkbox">
            <label>
              <input
                type="checkbox"
                id="edit-is_standard"
                name="is_standard"
                checked={editFormik.values.is_standard}
                onChange={editFormik.handleChange}
                onBlur={editFormik.handleBlur}
              />
              Standard Set
            </label>
          </div>

          <div className="form-control date-control">
            <label htmlFor="edit-release_date">Release Date</label>
            <div className="input-container">
              <input
                ref={editDateInputRef}
                type="date"
                id="edit-release_date"
                name="release_date"
                value={editFormik.values.release_date}
                onChange={handleEditDateChange}
                onBlur={editFormik.handleBlur}
                className={
                  editFormik.errors.release_date && editFormik.touched.release_date ? "error" : ""
                }
              />
              <div className="icon-container">
                <FontAwesomeIcon icon={faCalendar} className="date-picker-icon" />
              </div>
              {editFormik.errors.release_date && editFormik.touched.release_date && (
                <div className="error-msg">{editFormik.errors.release_date}</div>
              )}
            </div>
          </div>
        </form>
      </EditRecordModal>
    </div>
  );
}
