import { test, expect } from "@jest/globals";
import ydke from "ydke";

test("ydke-altart-3-pieces-with-incrementing-ids", () => {
  const ydkeURL = "ydke://GsrxABvK8QAcyvEA!2BQ7BA==!!";
  const result = ydke.parseURL(ydkeURL);
  console.log(result);
});

test("ydke-altart-all-dark-magicians", async () => {
  // doesnt have incrementing ids, but but same card with vastly different ids;
  // so not sure what can be done, when we cant find the id in the database?
  // return a dummy card that tells the user that the card is not found?
  const ydkeURL = "ydke://nIU0Aq70zAKx9MwC!!!";
  const result = ydke.parseURL(ydkeURL);
  console.log(result);
});
