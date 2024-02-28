const HeroController = {
  init(app, hero) {
    const keyState = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    app.ticker.add(() => {
      updatePosition();
    })

    function handleKeyDown(event) {
      const keyCode = event.code;
      keyState[keyCode] = true;
    }

    function handleKeyUp(event) {
      const keyCode = event.code;
      keyState[keyCode] = false;
    }


    function updatePosition() {
      const moveDistance = 3;

      if (keyState.ArrowUp && keyState.ArrowLeft) {
        hero.x -= moveDistance;
        hero.y -= moveDistance;
      } else if (keyState.ArrowUp && keyState.ArrowRight) {
        hero.x += moveDistance;
        hero.y -= moveDistance;
      } else if (keyState.ArrowDown && keyState.ArrowLeft) {
        hero.x -= moveDistance;
        hero.y += moveDistance;
      } else if (keyState.ArrowDown && keyState.ArrowRight) {
        hero.x += moveDistance;
        hero.y += moveDistance;
      } else if (keyState.ArrowUp) {
        hero.y -= moveDistance;
      } else if (keyState.ArrowDown) {
        hero.y += moveDistance;
      } else if (keyState.ArrowLeft) {
        hero.x -= moveDistance;
      } else if (keyState.ArrowRight) {
        hero.x += moveDistance;
      }
    }

  }
}

export default HeroController;