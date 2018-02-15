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

const uniq = function(arr, select) {
  var len = arr.length;
  var ret = [];
  var v;

  select = select ? (select instanceof Array ? select : [select]) : false;

  for (var i = 0; i < len; i++) {
    v = arr[i];
    if (select && !~indexOf(select, v)) {
      ret.push(v);
    } else if (!~indexOf(ret, v)) {
      ret.push(v);
    }
  }
  return ret;
};

const DEFAULT_Y = () => {
  const scroll = K.fromEvents(window, "scroll");
  const resize = K.fromEvents(window, "resize");
  const redraw = K.merge([scroll, resize]);

  return redraw.map(() => window.scrollY);
};

const DEFAULT_HEIGHT = () => {
  const scroll = K.fromEvents(window, "scroll");
  const resize = K.fromEvents(window, "resize");
  const redraw = K.merge([scroll, resize]);

  return redraw.map(() => window.innerHeight);
};

function illume(
  attribute,
  { scrollY = DEFAULT_Y(), windowHeight = DEFAULT_HEIGHT() } = {}
) {
  const getName = a => a.dataset[attribute];
  const areas = query(`[data-${attribute}]`);
  const names = areas.map(getName);

  const visibleY = K.combine([scrollY, windowHeight], (y, h) => y + h);
  const viewedAreas = visibleY.map(y => {
    return areas.filter(a => offsetAbove(y, a));
  });

  const lastViewedArea = viewedAreas.map(as => as[as.length - 1]);
  const activeArea = lastViewedArea
    .map(element => {
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
