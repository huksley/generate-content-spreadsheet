import React from "react";
import Head from "next/head";
import { Strings } from "@/components/Content";

export default function Home() {
  return (
    <main className="main">
      <Head>
        <title>{Strings.title}</title>
      </Head>
      <h1>{Strings.root.title}</h1>
      <p>{Strings.root.description}</p>
    </main>
  );
}
