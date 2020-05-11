export function setupMenuButtons(menuComponent) {
  menuComponent.menuData.menuButtons = [];
  const menuButtonsToLoad = [
    initialiseMenuButtons("Home", "home", "", (barNumber) => {}, null),
    initialiseMenuButtons(
      "Add",
      "add",
      "mdi-plus-circle",
      menuComponent.displayAddBarsDialog,
      menuComponent.displayAddBarsDialog
    ),
    initialiseMenuButtons(
      "Edit",
      "edit",
      "mdi-pencil",
      menuComponent.displayEditBarDialog,
      null
    ),
    initialiseMenuButtons(
      "Delete",
      "delete",
      "mdi-minus-circle",
      menuComponent.deleteBar,
      null
    ),
  ];

  menuButtonsToLoad.forEach((menuButton) => {
    menuComponent.menuData.menuButtons[menuButton.mode] = menuButton;
  });
}

export function selectDefaultTab(menuComponent) {
  let defaultButton = "add";
  let defaultButtonIndex = menuComponent.menuButtonModes.findIndex(
    (v) => v === defaultButton
  );
  menuComponent.menuData.tabSelected = defaultButtonIndex;
  menuComponent.menuData.subButtonStatus =
    menuComponent.menuData.menuButtons[defaultButton].subButtonStatus;
}

function assignSubButtonStatus(
  visibility,
  icon,
  executeFunction,
  noBarsBehaviour
) {
  return {
    visibility,
    icon,
    executeFunction,
    noBarsBehaviour, // null for no behaviour and don't draw a button; otherwise use the standard icon with the given behaviour
  };
}

function initialiseMenuButtons(
  label,
  mode,
  subButtonIcon,
  subButtonExecuteFunction,
  subButtonNoBarsBehaviour
) {
  return {
    label,
    mode,
    subButtonStatus: assignSubButtonStatus(
      subButtonIcon !== "",
      subButtonIcon,
      subButtonExecuteFunction,
      subButtonNoBarsBehaviour
    ),
  };
}
