const application = Stimulus.Application.start();
const electron = require("electron");
let ipc = electron.ipcRenderer;

const DETENIDO = 1;
const ACTIVO = 2;
const FINALIZADO = 3;

application.register(
  "app",
  class extends Stimulus.Controller {
    static get targets() {
      return ["bar", "contador", "progreso"];
    }

    actualizar() {}

    iniciar() {
      this.barTarget.classList.remove("invisible");
      this.contadorTarget.classList.remove("destellar");
      this.tiempo = 30;
      this.segundos = 0;
      this.estado = ACTIVO;
      this.actualizarUI();

      electron.ipcRenderer.on("reiniciar", () => {
        this.iniciar();
      });
    }

    tick() {
      if (this.estado === ACTIVO) {
        this.segundos += 1;

        if (this.segundos > 60) {
          this.tiempo -= 1;
          this.segundos = 0;

          if (this.tiempo < 0) {
            this.estado = FINALIZADO;
            this.contadorTarget.classList.add("destellar");
          } else {
            this.actualizarUI();
          }
        }
      }
    }

    actualizarUI() {
      this.contadorTarget.innerHTML = `${this.tiempo}'`;
      this.progresoTarget.style.width = `${(100 / 30) * this.tiempo}%`;

      ipc.send("actualizar-tray", `${this.tiempo}'`);
    }

    click() {
      this.iniciar();
    }

    connect() {
      this.tiempo = 0;
      this.estado = DETENIDO;
      this.barTarget.classList.add("invisible");
      ipc.send("actualizar-tray", `${this.tiempo}'`);

      setInterval(() => {
        this.tick();
      }, 1000);
    }
  }
);
