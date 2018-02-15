import { query } from "@standard-library/q-prime";
import { Kefir as K } from "kefir";

const offsetAbove = (y, element) => y > offsetTop(element);

const bottomAbove = (y, element) => {
  return y < offsetTop(element) + element.offsetHeight;
};

const offsetTop = element => {
  if (!element.getClientRects().length) {
    return 0;
  }

  const rect = element.getBoundingClientRect();
  const win = element.ownerDocument.defaultView;

  return rect.top + win.pageYOffset;
};

function illume(attribute) {
  const getName = a => a.dataset[attribute];
  const areas = query(`[data-${attribute}]`);
  const names = areas.map(getName);
  const scroll = K.fromEvents(window, "scroll");
  const resize = K.fromEvents(window, "resize");
  const redraw = K.merge([scroll, resize]);

  const scrollY = redraw.map(() => window.scrollY);
  const windowHeight = redraw.map(() => window.innerHeight);
  const visibileY = K.combine([scrollY, windowHeight], (y, h) => y + h);
  const viewedAreas = visibileY.map(function(y) {
    return areas.filter(a => offsetAbove(y, a));
  });

  const lastViewedArea = viewedAreas.map(as => as[as.length - 1]);
  const activeArea = lastViewedArea
    .map(function(element) {
      if (element && bottomAbove(window.scrollY, element)) {
        return element;
      }
    })
    .toProperty()
    .skipDuplicates();

  const active = activeArea.map(getName);
  const inactive = active
    .map(a => names.filter(n => n !== a))
    .map(uniq)
    .flatten();

  return {
    active,
    inactive
  };
}

export default illume;
