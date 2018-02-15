import test from "tape";

import illume from "../illume";

import { map, filter, reject, equals, uniq } from "ramda";
import { query } from "@standard-library/q-prime";
import { Kefir as K } from "kefir";

test("should return active stream", function(t) {
  const sections = illume("name");

  t.true("active" in sections);
  t.end();
});

test("should return inactive stream", function(t) {
  const sections = illume("name");

  t.true("inactive" in sections);
  t.end();
});

test("should return active class", function(t) {
  document.body.innerHTML = `
    <div class='breakfasts' data-name='breakfasts' style='background-color:red;height:2000px;'>
      Breakfasts
    </div>

    <div class='lunches' data-name='lunches' style='background-color:blue;height:1000px'>
      Lunches
    </div>
  `;
  const sections = illume("name");

  let values = [];
  const stream = sections.active.observe(x => {
    values.push(x);
  });

  window.scroll(0, 0);
  window.scroll(0, 2100);

  requestAnimationFrame(() => {
    t.same(values, ["lunches"]);
    t.end();

    stream.unsubscribe();
  });
});
