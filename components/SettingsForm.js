"use client";

import { useState } from "react";
import {
  EMPTY_SETTINGS,
  validateSettings,
} from "@/lib/validateSettings";

export default function SettingsForm() {
  const [values, setValues] = useState(EMPTY_SETTINGS);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("idle");

  function updateField(name, value) {
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    setStatus("idle");
    setSubmitted(false);

    if (touched[name] || name === "confirmPassword" || name === "password") {
      const nextErrors = validateSettings(nextValues);
      setErrors(nextErrors);
    }
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors(validateSettings(values));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateSettings(values);
    setErrors(nextErrors);
    setTouched({
      fullName: true,
      username: true,
      email: true,
      bio: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setSubmitted(false);
      return;
    }

    setStatus("saved");
    setSubmitted(true);
    setValues((current) => ({
      ...current,
      password: "",
      confirmPassword: "",
    }));
  }

  const fieldClass = (name) =>
    `mt-1 w-full rounded-lg border bg-white px-3 py-2 text-stone-900 shadow-sm outline-none transition focus:ring-2 ${
      errors[name]
        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
        : "border-stone-300 focus:border-teal-600 focus:ring-teal-200"
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-stone-200 bg-[var(--card)] p-6 shadow-sm"
      aria-describedby={status === "error" ? "form-error-summary" : undefined}
    >
      {status === "saved" && submitted ? (
        <p
          className="mb-5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-900"
          role="status"
        >
          Settings saved. Your profile is up to date.
        </p>
      ) : null}

      {status === "error" ? (
        <p
          id="form-error-summary"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          Please fix the highlighted fields before saving.
        </p>
      ) : null}

      <div className="space-y-4">
        <Field
          id="fullName"
          label="Full name"
          required
          error={errors.fullName}
        >
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={values.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className={fieldClass("fullName")}
          />
        </Field>

        <Field
          id="username"
          label="Username"
          required
          error={errors.username}
        >
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={values.username}
            onChange={(event) => updateField("username", event.target.value)}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.username)}
            aria-describedby={
              errors.username ? "username-error" : "username-hint"
            }
            className={fieldClass("username")}
          />
        </Field>
        {!errors.username ? (
          <p id="username-hint" className="-mt-3 text-xs text-stone-500">
            3–20 characters. Letters, numbers, and underscores only.
          </p>
        ) : null}

        <Field id="email" label="Email" required error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClass("email")}
          />
        </Field>

        <Field id="bio" label="Bio" error={errors.bio}>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            maxLength={180}
            value={values.bio}
            onChange={(event) => updateField("bio", event.target.value)}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.bio)}
            aria-describedby={errors.bio ? "bio-error" : "bio-hint"}
            className={`${fieldClass("bio")} resize-y`}
          />
        </Field>
        <p id="bio-hint" className="-mt-3 text-xs text-stone-500">
          {values.bio.trim().length}/160 characters
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="password"
            label="New password"
            error={errors.password}
          >
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={values.password}
              onChange={(event) => updateField("password", event.target.value)}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "password-error" : "password-hint"
              }
              className={fieldClass("password")}
            />
          </Field>

          <Field
            id="confirmPassword"
            label="Confirm password"
            error={errors.confirmPassword}
          >
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={(event) =>
                updateField("confirmPassword", event.target.value)
              }
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword ? "confirmPassword-error" : undefined
              }
              className={fieldClass("confirmPassword")}
            />
          </Field>
        </div>
        {!errors.password ? (
          <p id="password-hint" className="-mt-3 text-xs text-stone-500">
            Leave blank to keep your current password. New passwords need 8+
            characters with a letter and a number.
          </p>
        ) : null}

        <label className="flex items-start gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-3 text-sm text-stone-700">
          <input
            type="checkbox"
            name="emailNotifications"
            checked={values.emailNotifications}
            onChange={(event) =>
              updateField("emailNotifications", event.target.checked)
            }
            className="mt-0.5 h-4 w-4 rounded border-stone-300 text-teal-700 accent-teal-700"
          />
          <span>
            Email me product updates and account notices.
          </span>
        </label>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="submit"
          className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          Save settings
        </button>
      </div>
    </form>
  );
}

function Field({ id, label, required, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-stone-800">
        {label}
        {required ? (
          <span className="ml-0.5 text-red-700" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
