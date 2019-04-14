all:
	@echo ""
	@echo "Comandos disponibles:"
	@echo ""
	@echo " iniciar       instala todas las dependencias."
	@echo " ejecutar      ejecuta la aplicación."
	@echo " compilar      genera la aplicación en formato binario."
	@echo ""
	@echo ""

iniciar:
	npm install

ejecutar:
	npm start

compilar:
	npm run compilar
