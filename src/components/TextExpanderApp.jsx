import React from "react";
import TextExpander from "./TextExpander";
import "../App.css";

export default function TextExpanderApp() {
  return (
    <div>
      <TextExpander className="para-one">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,
        neque delectus. Adipisci incidunt debitis libero
      </TextExpander>

      <TextExpander
        className="para-two"
        collapseNumWords={10}
        expandButtonText={"Show Text"}
        collapseButtonText={"Collapse Text"}
        buttonColor="ff6622"
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium
        laboriosam inventore hic quasi soluta, quibusdam quos excepturi nesciunt
        amet modi temporibus nostrum quidem, illum provident error, at
        voluptatem corrupti dolores.
      </TextExpander>

      <TextExpander expanded={true} className="box">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor mollitia
        quo laboriosam, temporibus rem quibusdam accusamus recusandae
        repudiandae eveniet sed nulla, officiis repellat dignissimos odit
        reiciendis modi cupiditate ipsam tempora! Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Qui animi libero molestias deleniti ipsam
        tenetur. Consequatur aliquid esse, molestiae, incidunt eos eligendi
        exercitationem fugit doloribus nostrum asperiores, perferendis at
        quibusdam.
      </TextExpander>
    </div>
  );
}
