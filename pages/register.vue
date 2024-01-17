<script setup>
import { useCourseStore } from "@/stores/courseStore.js";
import { useUserStore } from "@/stores/userStore.js";
import { useSettingsStore } from "@/stores/settingsStore.js";

const client = useSupabaseClient();
const user = useSupabaseUser();

const courseStore = useCourseStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();

const router = useRouter();
const password = ref("");
const confirmPassword = ref("");
const spatialCode = ref("");
const instructor_code ="ce6e5235-64f5-4d56-99dc-f17ba857c85a"


const signUpUser = async () => {
  //const instructor_code = useRuntimeConfig().public.teacherCode;
  const accountType = spatialCode.value === instructor_code ? "instructor" : "student";
  let { data, error } = await client.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        first_name: firstName.value,
        last_name: lastName.value,
        spatialCode: spatialCode.value,
        account_type:
          spatialCode.value === instructor_code ? "instructor" : "student",
      },
    },
    if (error) {
      console.log(error);
      return;
    }
  });
    alert(
      `An account has been created under ${email.value}. You will be automatically logged in, please remember this email for password resets or email logins.`
    );
    router.push("/"); // Navigate to the login page
  
};
</script>

<template>
  <div
    class="min-w-screen min-h-screen flex items-center justify-center px-5 py-5 bg-emerald-800"
  >
    <div
      class="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full over p-5"
      style="max-width: 45rem"
    >
      <NuxtLink to="/">
        <Icon
          name="fluent-mdl2:back"
          class="mb-5 main-icon"
          size="24"
        />
      
      </NuxtLink>
      <div class="md:flex w-full justify-center">
        <div class="text-center mb-10">
          <Icon
            name="clarity:blocks-group-solid"
            class="mb-5 main-icon"
            size="48"
          />
          <h1 class="font-bold text-3xl text-green-400 mb-5">
            Create an account
          </h1>
          <form @submit.prevent="signUpUser" class="register-form">
            <div class="flex items-center justify-between">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" v-model="firstName" />
              </div>
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" v-model="lastName" />
              </div>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="email" />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" v-model="password" />
              <small>Password must be over 6 characters long</small>
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
              />
              <small>Passwords must match</small>
            </div>
            <div class="form-group">
              <label for="spatialCode"
                >Account Type Code <br />
                (Leave blank if unknown)</label
              >
              <input type="password" id="spatialCode" v-model="spatialCode" />
            </div>
            <div class="form-group">
              <button type="submit">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Add styles for the error message */
</style>

<!---<div class="register-container">
      <div class="register-box">
        <div class="logo">
          <Icon name="clarity:blocks-group-solid" class="main-icon" size="48" />
          <h3>Spatial Thinking</h3>
        </div>
        <h1>Create your account</h1>
        <form @submit.prevent="signUpUser" class="register-form">
          <div class="form-group">
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" v-model="firstName" />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" v-model="lastName" />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" />
          </div>
          <div class="form-group">
            <label for="spatialCode"
              >Account Type Code (Leave blank if unknown)</label
            >
            <input type="password" id="spatialCode" v-model="spatialCode" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" />
            <small>Password must be over 6 characters long</small>
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
            />
          </div>
          <div class="form-group">
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  -->
