import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "admin" | "user";
  skills: { value: string }[]; //array of objects 
  acceptTerms: boolean;
  profileType?: string;
};

const ReactHookForm: React.FC = () => {
  const {
    register, //connect inputs to rhf to track values and validations
    handleSubmit, // handle form submission
    control, // store field values , Tracks touched/dirty state ,connect React state with rhf state
    watch, //to watch the value 
    getValues, //get current form data 
    reset,
    trigger, //manually validate 
    formState: {
      errors,//validation  errors
      isSubmitting,// true when form submitting
      isValid, // true if all field valid   
    },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
      skills: [{ value: "" }],
      acceptTerms: false,
    },
  });

  /* useFieldArray */
  const { fields, append, remove } = useFieldArray({
    control, // react cant track dynamic array juz using ref , so control
    name: "skills",
  });

  /*  watch */
  const passwordValue = watch("password");
  const roleValue = watch("role");

  /* Submit Handler*/
  const onSubmit = (data: FormData) => {
    console.log("SUBMITTED DATA:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}   style={{
    minHeight: "130vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  }}>
      <div
    style={{
      width: "100%",
      maxWidth: "900px",
      padding: "24px",
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    }}
  >
      <h2>React Hook Form </h2>

      {/* NAME */}
      <input
        placeholder="Name"
        {...register("name", { required: "Name is required" })}
      />
      <p>{errors.name?.message}</p>

      {/* EMAIL */}
      <input
        placeholder="Email"
        {...register("email", {
          required: "Email required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email",
          },
        })}
      />
      <p>{errors.email?.message}</p>

      {/* PASSWORD */}
      <input
        type="password"
        placeholder="Password"
        {...register("password", {
          required: "Password required",
          minLength: { value: 6, message: "Min 6 chars" },
        })}
      />
      <p>{errors.password?.message}</p>

      {/* CONFIRM PASSWORD */}
      <input
        type="password"
        placeholder="Confirm Password"
        {...register("confirmPassword", {
          validate: (value) =>
            value === passwordValue || "Passwords do not match",
        })}
      />
      <p>{errors.confirmPassword?.message}</p>

      {/* ROLE  */}
      <Controller //rhf track value,onchange
        name="role"
        control={control}
        render={({ field }) => (
          <select {...field}> 
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        )}
      />

     
      {roleValue === "admin" && (
        <input
          placeholder="Admin Profile Type"
          {...register("profileType", {
            required: "Profile type required for admin",
          })}
        />
      )}
      <p>{errors.profileType?.message}</p>

      {/* DYNAMIC SKILLS */}
      <h4>Skills</h4>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input
            {...register(`skills.${index}.value`, {
              required: "Skill required",
            })}
          />
          <button type="button" onClick={() => remove(index)}>
            X
          </button>
          <p>{errors.skills?.[index]?.value?.message}</p>
        </div>
      ))}

      <button type="button" onClick={() => append({ value: "" })}>
        + Add Skill
      </button>

      {/* ACCEPT TERMS */}
      <label>
        <input
          type="checkbox"
          {...register("acceptTerms", {
            required: "You must accept terms",
          })}
        />
        Accept Terms
      </label>
      <p>{errors.acceptTerms?.message}</p>

      {/* BUTTONS */}
      <div style={{ marginTop: 20 }}>
        <button type="submit" disabled={!isValid || isSubmitting}>
          Submit
        </button>

        <button
          type="button"
          onClick={() => reset()}
          style={{ marginLeft: 10 }}
        >
          Reset
        </button>

        <button
          type="button"
          onClick={() => trigger()}
          style={{ marginLeft: 10 }}
        >
          Validate All
        </button>
      </div>

    
      <pre>{JSON.stringify(getValues(), null, 2)}</pre>
      </div>
    </form>
  );
};

export default ReactHookForm;