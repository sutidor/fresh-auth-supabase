// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../components/Layout.tsx";
import { State } from "./_middleware.ts";

export const handler: Handlers<any, State> = {
  GET(_req, ctx) {
    return ctx.render({...ctx.state});
  }
}

export default function Home(props: PageProps) {
  return (
    <Layout isLoggedIn={props.data.token}>
      <div class="mt-10 px-5 mx-auto flex max-w-screen-md flex-col justify-center">
        {props.data.token ?
          (
            <div class="mx-auto text-center">
              <a href="/prompts" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb