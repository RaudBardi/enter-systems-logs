import { UUID } from "uuidjs";
const str: string = UUID.generate();
const obj: UUID = UUID.genV4();

export function getId(): string {
  return str;
}
