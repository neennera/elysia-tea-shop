// Service handle business logic, decoupled from Elysia controller
import { status } from "elysia";
import { TeaManuModel } from "./model";

export abstract class TeaManuService {
  static async TeaManus() {
    return {
      data: "all manu",
    };
  }
  static async TeaManu(id: number) {
    return {
      data: `manu ${id}`,
    };
  }
  static async newTeaManu({ name, price }: TeaManuModel.NewTeaManuBody) {
    return {
      id: "new id ja",
      name,
      price,
    };
  }
  static async RemoveTeaManu(id: number) {
    return {
      data: `deleted manu ${id}`,
    };
  }
  static async UpdateTeaManu({
    id,
    name,
    price,
  }: TeaManuModel.TeaManuBodyType) {
    return {
      id: id,
      name,
      price,
    };
  }
}
