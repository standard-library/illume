import test from "tape";

import illume from "..";


test('returns active and inactive elements', function (t) {
  t.comment(JSON.stringify(illume("name")));
  t.end();
});
