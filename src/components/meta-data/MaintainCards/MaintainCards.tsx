import React, { useEffect, useMemo, useRef, useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import "../../../common/input-group.css";
import "../../../common/table.css";
import "../MaintainSets/MaintainSets.css";
import "./MaintainCards.css";
import { toast, Id } from "react-toastify";
import MaintainCardsResults from "./MaintainCardsResults";
import { displayErrorToast, updateToast } from "../../../common/toastHelpers";
import cardServiceImpl from "../../../services/CardService";
import { FormikHelpers, useFormik } from "formik";
import { cardSchema } from "../../../schemas/index";
import type { Card, CardUpsertPayload } from "../../../dto/Card";
import type { Set } from "../../../dto/Set";
import type { HeroClass } from "../../../dto/HeroClass";
import type { Tribe } from "../../../dto/Tribe";
import { usePagination } from "../../../common/pagination/usePagination";
import PaginationControls from "../../../common/pagination/PaginationControls";
import EditRecordModal from "../../../common/EditRecordModal";
import { CARD_TYPES, MECHANICS, RARITIES, SPELL_SCHOOLS } from "../../../constants/cardEnums";
import type { Mechanic } from "../../../constants/cardEnums";

interface CardFormValues {
  name: string;
  slug: string;
  flavor_text: string;

  card_type: string;
  rarity: string;
  spell_school: string;

  set_id: number | "";
  hero_class_id: number | "";
  race_tribe_id: number | "";

  mana_cost: number | "";
  attack: number | "";
  health: number | "";
  durability: number | "";

  text: string;

  is_collectible: boolean;
  is_token: boolean;

  mechanics: Record<Mechanic, boolean>;
}

const MECHANICS_WITH_DESCRIPTIONS: readonly Mechanic[] = [
  "BATTLECRY",
  "DEATHRATTLE",
  "DISCOVER",
  "OUTCAST",
  "INSPIRE",
  "SECRET",
  "COMBO",
  "SPELL_DAMAGE",
] as const;

interface MaintainCardsProps {
  cardService?: typeof cardServiceImpl;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

/** Lowercase slug from card name: spaces to dashes; other non-alphanumeric runs collapse to one dash. */
function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function emptyMechanics(): Record<Mechanic, boolean> {
  return MECHANICS.reduce(
    (acc, mechanic) => {
      acc[mechanic] = false;
      return acc;
    },
    {} as Record<Mechanic, boolean>
  );
}

function mechanicsFromCard(card: Card): Record<Mechanic, boolean> {
  const base = emptyMechanics();
  (card.card_mechanic_map ?? []).forEach(row => {
    base[row.mechanic] = true;
  });
  return base;
}

function selectedMechanics(mechanics: Record<Mechanic, boolean>): Mechanic[] {
  return MECHANICS.filter(m => mechanics[m]);
}

function emptyMechanicDescriptions(): Record<Mechanic, string> {
  return MECHANICS.reduce(
    (acc, mechanic) => {
      acc[mechanic] = "";
      return acc;
    },
    {} as Record<Mechanic, string>
  );
}

function parseStoredKeyword(value: string): { mechanic: Mechanic; description: string } | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  for (const mechanic of MECHANICS_WITH_DESCRIPTIONS) {
    if (trimmed === mechanic) {
      return { mechanic, description: "" };
    }
    if (trimmed.startsWith(`${mechanic}:`)) {
      return {
        mechanic,
        description: trimmed.slice(mechanic.length + 1).trim(),
      };
    }
  }

  return null;
}

function mechanicSelectionsFromCard(card: Card): {
  mechanics: Record<Mechanic, boolean>;
  descriptions: Record<Mechanic, string>;
} {
  const mechanics = mechanicsFromCard(card);
  const descriptions = emptyMechanicDescriptions();

  (card.card_keyword ?? []).forEach(row => {
    const parsed = parseStoredKeyword(row.keyword);
    if (!parsed) return;
    mechanics[parsed.mechanic] = true;
    descriptions[parsed.mechanic] = parsed.description;
  });

  return { mechanics, descriptions };
}

function selectedMechanicDescriptors(
  mechanics: Record<Mechanic, boolean>,
  descriptions: Record<Mechanic, string>
): string[] {
  const values: string[] = [];
  MECHANICS_WITH_DESCRIPTIONS.forEach(mechanic => {
    if (!mechanics[mechanic]) return;
    const descriptor = descriptions[mechanic].trim();
    if (!descriptor) return;
    values.push(`${mechanic}: ${descriptor}`);
  });
  return values;
}

function formatMechanicLabel(mechanic: Mechanic): string {
  return mechanic.replace(/_/g, " ");
}

function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === "object" &&
    error != null &&
    "code" in error &&
    "details" in error &&
    "message" in error &&
    typeof (error as PostgrestError).message === "string"
  );
}

function addCardToastSuccessMessage(hadImageFile: boolean, data: Card | null | undefined): string {
  if (!hadImageFile) {
    return "Card saved (no image selected)";
  }
  const linked = Boolean(data?.image_path ?? data?.image_url);
  return linked
    ? "Card saved; image uploaded and linked"
    : "Card saved but no image URL on the row (upload or DB update did not persist)";
}

function serviceErrorForToast(error: unknown): PostgrestError {
  if (isPostgrestError(error)) return error;

  const message =
    typeof error === "object" &&
    error != null &&
    "message" in error &&
    typeof error.message === "string"
      ? error.message
      : "Request failed";

  return new PostgrestError({
    message,
    details: "",
    hint: "",
    code: "UNKNOWN",
  });
}

function toNullableInt(value: number | ""): number | null {
  if (value === "") return null;
  return value;
}

function toUpsertPayload(values: CardFormValues): CardUpsertPayload {
  const isSpell = values.card_type === "SPELL";
  return {
    name: values.name,
    slug: values.slug,
    flavor_text: values.flavor_text.trim() ? values.flavor_text.trim() : null,
    card_type: values.card_type as CardUpsertPayload["card_type"],
    rarity: values.rarity as CardUpsertPayload["rarity"],
    spell_school: values.spell_school
      ? (values.spell_school as CardUpsertPayload["spell_school"])
      : null,
    set_id: Number(values.set_id),
    hero_class_id: Number(values.hero_class_id),
    race_tribe_id: isSpell
      ? null
      : values.race_tribe_id === ""
        ? null
        : Number(values.race_tribe_id),
    mana_cost: Number(values.mana_cost),
    attack: isSpell ? null : toNullableInt(values.attack),
    health: isSpell ? null : toNullableInt(values.health),
    durability: isSpell ? null : toNullableInt(values.durability),
    text: values.text,
    is_collectible: values.is_collectible,
    is_token: values.is_token,
    mechanics: selectedMechanics(values.mechanics),
    keywords: [],
    related_card_ids: [],
  };
}

export default function MaintainCards({
  cardService = cardServiceImpl,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
}: MaintainCardsProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [sets, setSets] = useState<Set[]>([]);
  const [heroClasses, setHeroClasses] = useState<HeroClass[]>([]);
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [mechanicDescriptions, setMechanicDescriptions] = useState<Record<Mechanic, string>>(
    emptyMechanicDescriptions()
  );
  const [editMechanicDescriptions, setEditMechanicDescriptions] = useState<
    Record<Mechanic, string>
  >(emptyMechanicDescriptions());

  const [addImageFile, setAddImageFile] = useState<File | null>(null);
  const [addImageInputKey, setAddImageInputKey] = useState(0);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  /** Always in sync on change — Formik submit can otherwise see a stale `null` file. */
  const addImageFileRef = useRef<File | null>(null);
  const editImageFileRef = useRef<File | null>(null);
  const addImageInputRef = useRef<HTMLInputElement | null>(null);
  const editImageInputRef = useRef<HTMLInputElement | null>(null);

  const addToastRef = useRef<Id | null>(null);
  const deleteToastRef = useRef<Id | null>(null);
  const updateToastRef = useRef<Id | null>(null);

  const initialFormValues: CardFormValues = {
    name: "",
    slug: "",
    flavor_text: "",
    card_type: "MINION",
    rarity: "COMMON",
    spell_school: "",
    set_id: "",
    hero_class_id: "",
    race_tribe_id: "",
    mana_cost: 0,
    attack: "",
    health: "",
    durability: "",
    text: "",
    is_collectible: true,
    is_token: false,
    mechanics: emptyMechanics(),
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } =
    useFormik<CardFormValues>({
      initialValues: initialFormValues,
      validationSchema: cardSchema,
      onSubmit: (formValues, actions) => addCard(formValues, actions),
    });

  const spellFieldsDisabled = values.card_type === "SPELL";

  const onAddCardTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e);
    if (e.target.value === "SPELL") {
      void setFieldValue("race_tribe_id", "");
      void setFieldValue("attack", "");
      void setFieldValue("health", "");
      void setFieldValue("durability", "");
    }
  };

  const editFormik = useFormik<CardFormValues>({
    enableReinitialize: true,
    initialValues: initialFormValues,
    validationSchema: cardSchema,
    onSubmit: (formValues, actions) => updateCard(formValues, actions),
  });

  const spellEditFieldsDisabled = editFormik.values.card_type === "SPELL";

  const onEditCardTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    editFormik.handleChange(e);
    if (e.target.value === "SPELL") {
      void editFormik.setFieldValue("race_tribe_id", "");
      void editFormik.setFieldValue("attack", "");
      void editFormik.setFieldValue("health", "");
      void editFormik.setFieldValue("durability", "");
    }
  };

  useEffect(() => {
    void setFieldValue("slug", slugify(values.name), false);
  }, [values.name, setFieldValue]);

  useEffect(() => {
    if (!isEditModalOpen) return;
    void editFormik.setFieldValue("slug", slugify(editFormik.values.name), false);
    // Slug is derived from name only; avoid re-running on every Formik object identity change.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- editFormik.values.name, isEditModalOpen
  }, [isEditModalOpen, editFormik.values.name]);

  const pagination = usePagination({
    items: cards,
    initialPageSize,
  });

  useEffect(() => {
    void loadPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPageData() {
    setIsLoading(true);
    try {
      const [cardsRes, setsRes, classesRes, tribesRes] = await Promise.all([
        cardService.fetchCards(),
        cardService.fetchSets(),
        cardService.fetchHeroClasses(),
        cardService.fetchTribes(),
      ]);

      if (cardsRes.error) displayErrorToast(cardsRes.error);
      else setCards((cardsRes.data as unknown as Card[]) ?? []);

      if (setsRes.error) displayErrorToast(setsRes.error);
      else setSets((setsRes.data as unknown as Set[]) ?? []);

      if (classesRes.error) displayErrorToast(classesRes.error);
      else setHeroClasses((classesRes.data as unknown as HeroClass[]) ?? []);

      if (tribesRes.error) displayErrorToast(tribesRes.error);
      else setTribes((tribesRes.data as unknown as Tribe[]) ?? []);
    } finally {
      setIsLoading(false);
    }
  }

  const addPreviewUrl = useMemo(() => {
    if (addImageFile) return URL.createObjectURL(addImageFile);
    return null;
  }, [addImageFile]);

  const editPreviewUrl = useMemo(() => {
    if (editImageFile) return URL.createObjectURL(editImageFile);
    if (editingCard?.image_url) return editingCard.image_url;
    return null;
  }, [editImageFile, editingCard?.image_url]);

  useEffect(() => {
    return () => {
      if (addPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(addPreviewUrl);
    };
  }, [addPreviewUrl]);

  useEffect(() => {
    return () => {
      if (editPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(editPreviewUrl);
    };
  }, [editPreviewUrl]);

  async function addCard(formValues: CardFormValues, actions: FormikHelpers<CardFormValues>) {
    const payload = toUpsertPayload(formValues);
    payload.keywords = selectedMechanicDescriptors(formValues.mechanics, mechanicDescriptions);

    addToastRef.current = toast("Adding record...");
    const imageToUpload = addImageFileRef.current ?? addImageInputRef.current?.files?.[0] ?? null;
    const { error, data } = await cardService.addCard(payload, imageToUpload);
    updateToast(
      addToastRef,
      error ? serviceErrorForToast(error) : null,
      true,
      addCardToastSuccessMessage(Boolean(imageToUpload), data)
    );

    if (error == null) {
      actions.resetForm();
      setMechanicDescriptions(emptyMechanicDescriptions());
      addImageFileRef.current = null;
      setAddImageFile(null);
      setAddImageInputKey(k => k + 1);
      await loadPageData();
    }
  }

  async function deleteCard(id: string) {
    deleteToastRef.current = toast("Deleting record...");
    const { error } = await cardService.deleteCard(id);
    updateToast(deleteToastRef, error, true);

    if (error == null) {
      await loadPageData();
    }
  }

  function openEditModal(card: Card) {
    setEditingCard(card);
    editImageFileRef.current = null;
    setEditImageFile(null);
    const mechanicSelections = mechanicSelectionsFromCard(card);
    setEditMechanicDescriptions(mechanicSelections.descriptions);

    editFormik.setValues({
      name: card.name,
      slug: slugify(card.name),
      flavor_text: card.flavor_text ?? "",
      card_type: card.card_type,
      rarity: card.rarity,
      spell_school: card.spell_school ?? "",
      set_id: card.set_id,
      hero_class_id: card.hero_class_id,
      race_tribe_id: card.race_tribe_id ?? "",
      mana_cost: card.mana_cost,
      attack: card.attack ?? "",
      health: card.health ?? "",
      durability: card.durability ?? "",
      text: card.text,
      is_collectible: card.is_collectible,
      is_token: card.is_token,
      mechanics: mechanicSelections.mechanics,
    });

    setIsEditModalOpen(true);
  }

  const closeEditModal = () => {
    if (isUpdating) return;
    setIsEditModalOpen(false);
    editFormik.resetForm();
    setEditingCard(null);
    editImageFileRef.current = null;
    setEditImageFile(null);
    setEditMechanicDescriptions(emptyMechanicDescriptions());
  };

  async function updateCard(formValues: CardFormValues, actions: FormikHelpers<CardFormValues>) {
    if (!editingCard) return;

    const payload = toUpsertPayload(formValues);
    payload.keywords = selectedMechanicDescriptors(formValues.mechanics, editMechanicDescriptions);

    setIsUpdating(true);
    updateToastRef.current = toast("Updating record...");
    const editImageToUpload =
      editImageFileRef.current ?? editImageInputRef.current?.files?.[0] ?? null;
    const { error } = await cardService.updateCard(editingCard.id, payload, editImageToUpload);
    const updateSuccessMessage = editImageToUpload
      ? "Record updated; image uploaded and linked"
      : "Record updated";
    updateToast(
      updateToastRef,
      error ? serviceErrorForToast(error) : null,
      true,
      updateSuccessMessage
    );

    if (error == null) {
      actions.resetForm();
      setIsEditModalOpen(false);
      setEditingCard(null);
      editImageFileRef.current = null;
      setEditImageFile(null);
      setEditMechanicDescriptions(emptyMechanicDescriptions());
      await loadPageData();
    }

    setIsUpdating(false);
  }

  const onMechanicToggle = (mechanic: Mechanic, checked: boolean) => {
    void setFieldValue("mechanics", { ...values.mechanics, [mechanic]: checked });
    if (!checked && MECHANICS_WITH_DESCRIPTIONS.includes(mechanic)) {
      setMechanicDescriptions(prev => ({ ...prev, [mechanic]: "" }));
    }
  };

  const onEditMechanicToggle = (mechanic: Mechanic, checked: boolean) => {
    void editFormik.setFieldValue("mechanics", {
      ...editFormik.values.mechanics,
      [mechanic]: checked,
    });
    if (!checked && MECHANICS_WITH_DESCRIPTIONS.includes(mechanic)) {
      setEditMechanicDescriptions(prev => ({ ...prev, [mechanic]: "" }));
    }
  };

  return (
    <div className="maintain-data maintain-cards">
      <div className="maintain-cards-page-header">
        <h2>Manage Cards</h2>
        <p>Create, update, and curate your full card catalog.</p>
      </div>
      <div className="input-group">
        <form onSubmit={handleSubmit} role="form" data-testid="add-card-form">
          <div className="form-row">
            <div className="maintain-cards-grid">
              <div className="form-control">
                <label htmlFor="name">Name</label>
                <div className="input-container">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.name && touched.name ? "error" : ""}
                  />
                  {errors.name && touched.name && <div className="error-msg">{errors.name}</div>}
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="slug">Slug</label>
                <div className="input-container">
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    readOnly
                    aria-readonly="true"
                    tabIndex={-1}
                    data-testid="add-card-slug"
                    value={values.slug}
                    title="Generated from the card name"
                    className={`maintain-cards-slug-readonly${errors.slug && touched.slug ? " error" : ""}`}
                  />
                  {errors.slug && touched.slug && <div className="error-msg">{errors.slug}</div>}
                </div>
                <p className="maintain-cards-slug-hint">
                  From name: lowercase, spaces become dashes.
                </p>
              </div>

              <div className="form-control">
                <label htmlFor="set_id">Set</label>
                <div className="input-container">
                  <select
                    id="set_id"
                    name="set_id"
                    value={values.set_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.set_id && touched.set_id ? "error" : ""}
                  >
                    <option value="">Select a set</option>
                    {sets.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.set_id && touched.set_id && (
                    <div className="error-msg">{errors.set_id}</div>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="hero_class_id">Class</label>
                <div className="input-container">
                  <select
                    id="hero_class_id"
                    name="hero_class_id"
                    value={values.hero_class_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.hero_class_id && touched.hero_class_id ? "error" : ""}
                  >
                    <option value="">Select a class</option>
                    {heroClasses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.hero_class_id && touched.hero_class_id && (
                    <div className="error-msg">{errors.hero_class_id}</div>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="card_type">Card type</label>
                <div className="input-container">
                  <select
                    id="card_type"
                    name="card_type"
                    value={values.card_type}
                    onChange={onAddCardTypeChange}
                    onBlur={handleBlur}
                  >
                    {CARD_TYPES.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="race_tribe_id">Race (tribe)</label>
                <div className="input-container">
                  <select
                    id="race_tribe_id"
                    name="race_tribe_id"
                    value={values.race_tribe_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={spellFieldsDisabled}
                  >
                    <option value="">None</option>
                    {tribes.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="rarity">Rarity</label>
                <div className="input-container">
                  <select
                    id="rarity"
                    name="rarity"
                    value={values.rarity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {RARITIES.map(r => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="spell_school">Spell school</label>
                <div className="input-container">
                  <select
                    id="spell_school"
                    name="spell_school"
                    value={values.spell_school}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">None</option>
                    {SPELL_SCHOOLS.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="mana_cost">Mana</label>
                <div className="input-container">
                  <input
                    id="mana_cost"
                    name="mana_cost"
                    type="number"
                    placeholder="Mana"
                    value={values.mana_cost}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.mana_cost && touched.mana_cost ? "error" : ""}
                  />
                  {errors.mana_cost && touched.mana_cost && (
                    <div className="error-msg">{errors.mana_cost}</div>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="attack">Attack</label>
                <div className="input-container">
                  <input
                    id="attack"
                    name="attack"
                    type="number"
                    placeholder="Attack"
                    value={values.attack}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={spellFieldsDisabled}
                    className={errors.attack && touched.attack ? "error" : ""}
                  />
                  {errors.attack && touched.attack && (
                    <div className="error-msg">{errors.attack}</div>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="health">Health</label>
                <div className="input-container">
                  <input
                    id="health"
                    name="health"
                    type="number"
                    placeholder="Health"
                    value={values.health}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={spellFieldsDisabled}
                    className={errors.health && touched.health ? "error" : ""}
                  />
                  {errors.health && touched.health && (
                    <div className="error-msg">{errors.health}</div>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="durability">Durability</label>
                <div className="input-container">
                  <input
                    id="durability"
                    name="durability"
                    type="number"
                    placeholder="Durability"
                    value={values.durability}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={spellFieldsDisabled}
                    className={errors.durability && touched.durability ? "error" : ""}
                  />
                  {errors.durability && touched.durability && (
                    <div className="error-msg">{errors.durability}</div>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="card_image">Card image</label>
                <div className="input-container">
                  <input
                    key={addImageInputKey}
                    id="card_image"
                    ref={addImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const f = e.target.files?.[0] ?? null;
                      addImageFileRef.current = f;
                      setAddImageFile(f);
                    }}
                  />
                </div>
                <div className="maintain-cards-file-name">
                  {addImageFile?.name ? `Selected: ${addImageFile.name}` : "No file selected"}
                </div>
                <p className="maintain-cards-file-hint">
                  Images upload only when a file is chosen here before you submit. Sign in is
                  required for storage.
                </p>
              </div>
            </div>
          </div>

          <div className="form-row maintain-cards-row-full">
            <div className="form-control maintain-cards-field-full">
              <label htmlFor="text">Card text</label>
              <div className="input-container">
                <textarea
                  id="text"
                  name="text"
                  rows={4}
                  placeholder="Card text"
                  value={values.text}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.text && touched.text ? "error" : ""}
                />
                {errors.text && touched.text && <div className="error-msg">{errors.text}</div>}
              </div>
            </div>
          </div>

          <div className="form-row maintain-cards-row-full">
            <div className="form-control maintain-cards-field-full">
              <label htmlFor="flavor_text">Flavor text</label>
              <div className="input-container">
                <textarea
                  id="flavor_text"
                  name="flavor_text"
                  rows={2}
                  placeholder="Flavor text"
                  value={values.flavor_text}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          </div>

          <div className="form-row maintain-cards-row-inline">
            <div className="checkbox-control">
              <label>
                <input
                  type="checkbox"
                  name="is_collectible"
                  checked={values.is_collectible}
                  onChange={handleChange}
                />
                Collectible
              </label>
            </div>
            <div className="checkbox-control">
              <label>
                <input
                  type="checkbox"
                  name="is_token"
                  checked={values.is_token}
                  onChange={handleChange}
                />
                Token
              </label>
            </div>
          </div>

          <div className="form-row maintain-cards-row-split">
            <div className="form-control maintain-cards-split-item maintain-cards-mechanics-pane">
              <div>Mechanics</div>
              <div className="maintain-cards-mechanics" data-testid="add-mechanics">
                {MECHANICS.map(mechanic => (
                  <div key={mechanic} className="maintain-cards-mechanic-row">
                    <label className="maintain-cards-mechanic">
                      <input
                        type="checkbox"
                        checked={values.mechanics[mechanic]}
                        onChange={e => onMechanicToggle(mechanic, e.target.checked)}
                      />
                      <span>{formatMechanicLabel(mechanic)}</span>
                    </label>
                    {MECHANICS_WITH_DESCRIPTIONS.includes(mechanic) &&
                      values.mechanics[mechanic] && (
                        <input
                          className="maintain-cards-mechanic-description"
                          type="text"
                          placeholder={`${formatMechanicLabel(mechanic)} description`}
                          value={mechanicDescriptions[mechanic]}
                          onChange={e =>
                            setMechanicDescriptions(prev => ({
                              ...prev,
                              [mechanic]: e.target.value,
                            }))
                          }
                        />
                      )}
                  </div>
                ))}
              </div>
            </div>

            {addPreviewUrl && (
              <div className="form-control">
                <div>Preview</div>
                <img
                  className="maintain-cards-preview"
                  src={addPreviewUrl}
                  alt="Selected card preview"
                />
              </div>
            )}
          </div>

          <input type="submit" value="Submit" />
        </form>
      </div>

      <MaintainCardsResults
        isLoading={isLoading}
        cards={pagination.pagedItems}
        deleteCard={deleteCard}
        onSelectCard={openEditModal}
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
        title="Edit Card"
        onCancel={closeEditModal}
        onSave={editFormik.submitForm}
        isSaving={isUpdating}
      >
        <form onSubmit={editFormik.handleSubmit} role="form" data-testid="edit-card-form">
          <div className="form-row">
            <div className="maintain-cards-grid">
              <div className="form-control">
                <label htmlFor="edit-name">Name</label>
                <div className="input-container">
                  <input
                    id="edit-name"
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

              <div className="form-control">
                <label htmlFor="edit-slug">Slug</label>
                <div className="input-container">
                  <input
                    id="edit-slug"
                    name="slug"
                    type="text"
                    readOnly
                    aria-readonly="true"
                    tabIndex={-1}
                    data-testid="edit-card-slug"
                    value={editFormik.values.slug}
                    title="Generated from the card name"
                    className={`maintain-cards-slug-readonly${
                      editFormik.errors.slug && editFormik.touched.slug ? " error" : ""
                    }`}
                  />
                  {editFormik.errors.slug && editFormik.touched.slug && (
                    <div className="error-msg">{editFormik.errors.slug}</div>
                  )}
                </div>
                <p className="maintain-cards-slug-hint">
                  From name: lowercase, spaces become dashes.
                </p>
              </div>

              <div className="form-control">
                <label htmlFor="edit-set_id">Set</label>
                <div className="input-container">
                  <select
                    id="edit-set_id"
                    name="set_id"
                    value={editFormik.values.set_id}
                    onChange={editFormik.handleChange}
                    onBlur={editFormik.handleBlur}
                  >
                    <option value="">Select a set</option>
                    {sets.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="edit-hero_class_id">Class</label>
                <div className="input-container">
                  <select
                    id="edit-hero_class_id"
                    name="hero_class_id"
                    value={editFormik.values.hero_class_id}
                    onChange={editFormik.handleChange}
                    onBlur={editFormik.handleBlur}
                  >
                    <option value="">Select a class</option>
                    {heroClasses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="edit-card_type">Card type</label>
                <div className="input-container">
                  <select
                    id="edit-card_type"
                    name="card_type"
                    value={editFormik.values.card_type}
                    onChange={onEditCardTypeChange}
                    onBlur={editFormik.handleBlur}
                  >
                    {CARD_TYPES.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="edit-race_tribe_id">Race (tribe)</label>
                <div className="input-container">
                  <select
                    id="edit-race_tribe_id"
                    name="race_tribe_id"
                    value={editFormik.values.race_tribe_id}
                    onChange={editFormik.handleChange}
                    onBlur={editFormik.handleBlur}
                    disabled={spellEditFieldsDisabled}
                  >
                    <option value="">None</option>
                    {tribes.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="edit-rarity">Rarity</label>
                <div className="input-container">
                  <select
                    id="edit-rarity"
                    name="rarity"
                    value={editFormik.values.rarity}
                    onChange={editFormik.handleChange}
                    onBlur={editFormik.handleBlur}
                  >
                    {RARITIES.map(r => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="edit-spell_school">Spell school</label>
                <div className="input-container">
                  <select
                    id="edit-spell_school"
                    name="spell_school"
                    value={editFormik.values.spell_school}
                    onChange={editFormik.handleChange}
                    onBlur={editFormik.handleBlur}
                  >
                    <option value="">None</option>
                    {SPELL_SCHOOLS.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="edit-mana_cost">Mana</label>
                <div className="input-container">
                  <input
                    id="edit-mana_cost"
                    name="mana_cost"
                    type="number"
                    placeholder="Mana"
                    value={editFormik.values.mana_cost}
                    onChange={editFormik.handleChange}
                    onBlur={editFormik.handleBlur}
                  />
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="edit-attack">Attack</label>
                <div className="input-container">
                  <input
                    id="edit-attack"
                    name="attack"
                    type="number"
                    placeholder="Attack"
                    value={editFormik.values.attack}
                    onChange={editFormik.handleChange}
                    onBlur={editFormik.handleBlur}
                    disabled={spellEditFieldsDisabled}
                  />
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="edit-health">Health</label>
                <div className="input-container">
                  <input
                    id="edit-health"
                    name="health"
                    type="number"
                    placeholder="Health"
                    value={editFormik.values.health}
                    onChange={editFormik.handleChange}
                    onBlur={editFormik.handleBlur}
                    disabled={spellEditFieldsDisabled}
                  />
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="edit-durability">Durability</label>
                <div className="input-container">
                  <input
                    id="edit-durability"
                    name="durability"
                    type="number"
                    placeholder="Durability"
                    value={editFormik.values.durability}
                    onChange={editFormik.handleChange}
                    onBlur={editFormik.handleBlur}
                    disabled={spellEditFieldsDisabled}
                  />
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="edit-card_image">Card image</label>
                <div className="input-container">
                  <input
                    id="edit-card_image"
                    ref={editImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const f = e.target.files?.[0] ?? null;
                      editImageFileRef.current = f;
                      setEditImageFile(f);
                    }}
                  />
                </div>
                <div className="maintain-cards-file-name">
                  {editImageFile?.name ? `Selected: ${editImageFile.name}` : "No file selected"}
                </div>
              </div>
            </div>
          </div>

          <div className="form-row maintain-cards-row-full">
            <div className="form-control maintain-cards-field-full">
              <label htmlFor="edit-text">Card text</label>
              <div className="input-container">
                <textarea
                  id="edit-text"
                  name="text"
                  rows={4}
                  placeholder="Card text"
                  value={editFormik.values.text}
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                />
              </div>
            </div>
          </div>

          <div className="form-row maintain-cards-row-full">
            <div className="form-control maintain-cards-field-full">
              <label htmlFor="edit-flavor_text">Flavor text</label>
              <div className="input-container">
                <textarea
                  id="edit-flavor_text"
                  name="flavor_text"
                  rows={2}
                  placeholder="Flavor text"
                  value={editFormik.values.flavor_text}
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                />
              </div>
            </div>
          </div>

          <div className="form-row maintain-cards-row-inline">
            <div className="checkbox-control">
              <label>
                <input
                  type="checkbox"
                  name="is_collectible"
                  checked={editFormik.values.is_collectible}
                  onChange={editFormik.handleChange}
                />
                Collectible
              </label>
            </div>
            <div className="checkbox-control">
              <label>
                <input
                  type="checkbox"
                  name="is_token"
                  checked={editFormik.values.is_token}
                  onChange={editFormik.handleChange}
                />
                Token
              </label>
            </div>
          </div>

          <div className="form-row maintain-cards-row-split">
            <div className="form-control maintain-cards-split-item maintain-cards-mechanics-pane">
              <div>Mechanics</div>
              <div className="maintain-cards-mechanics" data-testid="edit-mechanics">
                {MECHANICS.map(mechanic => (
                  <div key={mechanic} className="maintain-cards-mechanic-row">
                    <label className="maintain-cards-mechanic">
                      <input
                        type="checkbox"
                        checked={editFormik.values.mechanics[mechanic]}
                        onChange={e => onEditMechanicToggle(mechanic, e.target.checked)}
                      />
                      <span>{formatMechanicLabel(mechanic)}</span>
                    </label>
                    {MECHANICS_WITH_DESCRIPTIONS.includes(mechanic) &&
                      editFormik.values.mechanics[mechanic] && (
                        <input
                          className="maintain-cards-mechanic-description"
                          type="text"
                          placeholder={`${formatMechanicLabel(mechanic)} description`}
                          value={editMechanicDescriptions[mechanic]}
                          onChange={e =>
                            setEditMechanicDescriptions(prev => ({
                              ...prev,
                              [mechanic]: e.target.value,
                            }))
                          }
                        />
                      )}
                  </div>
                ))}
              </div>
            </div>

            {editPreviewUrl && (
              <div className="form-control">
                <div>Preview</div>
                <img className="maintain-cards-preview" src={editPreviewUrl} alt="Card preview" />
              </div>
            )}
          </div>
        </form>
      </EditRecordModal>
    </div>
  );
}
