export function compatAutoanimations() {
  if (!game.modules.has("autoanimations")) {
    return;
  }

  Hooks.on(
    "AutomatedAnimations-WorkflowStart",
    (data: any, animationData: any) => {
      if (animationData) return;

      let changed = false;

      if (data.item?.flags?.babele?.originalName) {
        data.item = createItemNameProxy(
          data.item,
          data.item.flags.babele.originalName
        );
        changed = true;
      }
      if (data.ammoItem?.flags?.babele?.originalName) {
        data.ammoItem = createItemNameProxy(
          data.ammoItem,
          data.ammoItem.flags.babele.originalName
        );
        changed = true;
      }
      if (data.originalItem?.flags?.babele?.originalName) {
        data.originalItem = createItemNameProxy(
          data.originalItem,
          data.originalItem.flags.babele.originalName
        );
        changed = true;
      }

      if (changed) {
        data.recheckAnimation = true;
      }
    }
  );
}

function createItemNameProxy(item: any, realName: string) {
  return new Proxy(item, {
    get(target, p, receiver) {
      if (p === "name") {
        return realName;
      }
      return Reflect.get(target, p, receiver);
    },
  });
}
