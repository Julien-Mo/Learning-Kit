"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

const Lesson = () => {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("id");

  return (
    <div>
      Lesson {lessonId}
      <p>
        Note: we will have a number of lessons as seen on the designs. we'll
        only design one lesson, but generally each lesson will have an "id" with
        the lesson metadata store in the database. we'll use this id to decide
        what to fetch. For simplicity, I recommend creating a{" "}
        <code>lesson.json</code> file somewhere and using that for the data as
        opposed to an API route.
      </p>
    </div>
  );
};

export default Lesson;
