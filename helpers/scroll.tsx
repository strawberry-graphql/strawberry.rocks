export const scrollIntoViewIfNeeded = (element: HTMLElement) => {
  const parent = element.parentNode as HTMLElement;
  const parentComputedStyle = window.getComputedStyle(parent, null);
  const parentBorderTopWidth = parseInt(
    parentComputedStyle.getPropertyValue("border-top-width")
  );
  const parentBorderLeftWidth = parseInt(
    parentComputedStyle.getPropertyValue("border-left-width")
  );
  const overTop = element.offsetTop - parent.offsetTop < parent.scrollTop;
  const overBottom =
    element.offsetTop -
      parent.offsetTop +
      element.clientHeight -
      parentBorderTopWidth >
    parent.scrollTop + parent.clientHeight;
  const overLeft = element.offsetLeft - parent.offsetLeft < parent.scrollLeft;
  const overRight =
    element.offsetLeft -
      parent.offsetLeft +
      element.clientWidth -
      parentBorderLeftWidth >
    parent.scrollLeft + parent.clientWidth;
  const alignWithTop = overTop && !overBottom;

  if (overTop || overBottom) {
    parent.scrollTop =
      element.offsetTop -
      parent.offsetTop -
      parent.clientHeight / 2 -
      parentBorderTopWidth +
      element.clientHeight / 2;
  }

  if (overLeft || overRight) {
    parent.scrollLeft =
      element.offsetLeft -
      parent.offsetLeft -
      parent.clientWidth / 2 -
      parentBorderLeftWidth +
      element.clientWidth / 2;
  }

  if (overTop || overBottom || overLeft || overRight) {
    element.scrollIntoView(alignWithTop);
  }
};
