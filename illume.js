import { map, filter, reject, equals, uniq } from "ramda";
import { query } from "@standard-library/q";
import { Kefir as K } from "kefir";

const offsetAbove = (y, element) => y > element.offsetTop;
const bottomAbove = (y, element) => {
  return y < element.offsetTop + element.offsetHeight;
};

function illume(attribute) {
  const getName = (a) => $(a).data(attribute);
  const areas = query(`[data-${attribute}]`);
  const names = map(getName, areas);

  const scroll = K.fromEvents(window, "scroll");
  const resize = K.fromEvents(window, "resize");
  const redraw = K.merge([scroll, resize]);

  const scrollY = redraw.map(() => window.scrollY;
  const windowHeight = redraw.map(() => window.innerHeight;
  const visibileY = K.combine([scrollY, windowHeight], (y, h) => y + h);

  const viewedAreas = visibileY.map(function (y) {
    return filter((a) => offsetAbove(y, a), areas);
  });
  const lastViewedArea = viewedAreas.map((as) => as[as.length - 1]);
  const activeArea =
    lastViewedArea.map(function (element) {
      if (element && bottomAbove($window.scrollTop(), element)) {
        return element;
      }
    }).toProperty().skipDuplicates();

  const active = activeArea.map(getName);
  const inactive =
    active
      .map((a) =>  reject(equals(a), names))
      .map(uniq)
      .flatten();

  return {
    active,
    inactive
  }
}

export default illume;
