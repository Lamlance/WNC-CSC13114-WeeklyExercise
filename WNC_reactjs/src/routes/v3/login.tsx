import React, { useEffect } from "react";
import {
  FieldErrors,
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  Resolver,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/Redux/ReduxHook";
import { setLoading } from "../../hooks/Redux/LoadingSlice";
const SERVER_URL = "http://localhost:3030";
function ThirdLoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(function () {
    dispatch(setLoading("Logging out"));
  }, []);

  async function onSubmit(formData: FieldValues) {
    try {
      dispatch(setLoading("Logging in"));
      const data = await fetch(`${SERVER_URL}/login`, {
        method: "POST",
        body: JSON.stringify(formData),
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { access_token } = await data.json();
      if (access_token) {
        localStorage.setItem("accessToken", access_token);
        setTimeout(() => navigate("/v3"), 2000);
      }
      console.log(access_token);
    } catch (e) {
      console.warn(e);
    }
  }

  function onInvalid(err: FieldErrors<FieldValues>) {}

  return (
    <div className="grid w-screen h-screen place-items-center">
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="flex flex-col gap-y-4 w-full"
      >
        <h1 className=" text-center font-semibold text-4xl">
          To to list login
        </h1>
        <input
          placeholder="User name"
          id="user_name_input"
          type="text"
          {...register("user_name", { required: true })}
          className=" w-full border border-gray-500 max-w-md px-4 py-2 self-center rounded-lg"
        />
        <div className=" w-full max-w-md self-center rounded-lg">
          <input
            placeholder="Password"
            type="password"
            {...register("pwd", { required: true })}
            className=" w-full border border-gray-500 max-w-md px-4 py-2 self-center rounded-lg"
          />
        </div>

        <input
          type="submit"
          value={"Submit"}
          className=" w-full border bg-blue-500 text-white max-w-md px-4 py-2 self-center cursor-pointer rounded-lg hover:shadow-lg"
        />
      </form>
    </div>
  );
}
export default ThirdLoginPage;
