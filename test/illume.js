import test from "tape";

import illume from "../illume";

import { map, filter, reject, equals, uniq } from "ramda";
import { query } from "@standard-library/q-prime";
import { Kefir as K } from "kefir";

test('should return active stream', function (t) {
  document.body.innerHTML = "<div class='breakfasts' data-name='breakfasts' style='background-color:red;height:2000px;'>Breakfasts</div><div class='lunches' data-name='lunches' style='background-color:blue;height:1000px'>Lunches</div>";
  window.scroll(10, 1000);
  const sections = illume("name");
  t.true(sections.active);
  t.end();
});

test('should return inactive stream', function (t) {
  document.body.innerHTML = "<div class='breakfasts' data-name='breakfasts' style='background-color:red;height:2000px;'>Breakfasts</div><div class='lunches' data-name='lunches' style='background-color:blue;height:1000px'>Lunches</div>";
  window.scroll(10, 1000);
  const sections = illume("name");
  t.true(sections.inactive);
  t.end();
});

test('should return active class', function (t) {
  document.body.innerHTML = "<div class='breakfasts' data-name='breakfasts' style='background-color:red;height:2000px;'>Breakfasts</div><div class='lunches' data-name='lunches' style='background-color:blue;height:1000px'>Lunches</div>";
  window.scroll(10, 2001);
  const sections = illume("name");
  sections.active.onValue((name) => {
    const elements = document.querySelectorAll(`[data-name="${name}"]`);
    const lunchElement = document.getElementsByClassName("lunches")[0];
    t.equal(elements[0], lunchElement);
    t.end();
  });
});
