// tslint:disable-next-line: import-name
import React from "react";
import AnimalDetailsCard from "./AnimalDetailsCard";
import { Animal } from "dc2410-coursework-common";

export class AnimalDetailsSection extends React.Component<{ animal: Animal }> {
  public render = () => (
    <section className="col-md-12 col-lg-8" id="animal-details">
      <h3>{this.props.animal.name}</h3>

      <AnimalDetailsCard animal={this.props.animal} />
    </section>
  );
}

export default AnimalDetailsSection;