import FlakeId from "flake-idgen";
import initFomart from "biguint-format";

const flakeIdGen = new FlakeId();

export const NextId = () => {
  return initFomart(flakeIdGen.next(), "dec");
};
