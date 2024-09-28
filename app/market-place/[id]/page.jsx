import React from "react";
import prisma from "../../../db/db.config";
import Hero from "./Hero";
export const dynamic = "force-dynamic";

const page = async ({ params }) => {
  console.log("Hey this is ashu");
  console.log("the id is ", params.id);
  const data = await prisma.post.findUnique({
    where: {
      id: params.id,
    },
    include: {
      user: true,
    },
  });
  console.log("the prodcts data is ", data);
  return (
    <div className="pt-32">
      <Hero data={data} />
    </div>
  );
};

export default page;
