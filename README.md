# backend
 
docker-compose exec webapp npm install

## API Endpoints

### User Endpoints

#### Sign Up
- **URL:** `/users/signup`
- **Method:** `POST`
- **Description:** Crea un nuevo usuario.
- **Request Body:**
  - `email` (string): Email del usuario.
  - `password` (string): Contraseña del usuario.
  - `name` (string, opcional): Nombre del usuario.
  - `phone` (string, opcional): Teléfono del usuario.
  - `address` (string, opcional): Dirección del usuario.
- **Response:**
  - `201 Created`: Usuario creado exitosamente.
  - `400 Bad Request`: Email y password son requeridos.
  - `500 Internal Server Error`: Error al crear el usuario.

#### Sign In
- **URL:** `/users/signin`
- **Method:** `POST`
- **Description:** Inicia sesión un usuario.
- **Request Body:**
  - `email` (string): Email del usuario.
  - `password` (string): Contraseña del usuario.
- **Response:**
  - `200 OK`: Inicio de sesión exitoso.
  - `400 Bad Request`: Email y password son requeridos.
  - `404 Not Found`: Usuario no encontrado.
  - `401 Unauthorized`: Contraseña incorrecta.
  - `500 Internal Server Error`: Error en el servidor.

#### Get User by ID
- **URL:** `/users/:id`
- **Method:** `GET`
- **Description:** Obtiene un usuario por su ID.
- **Parameters:**
  - `id` (URL parameter): ID del usuario.
- **Response:**
  - `200 OK`: Usuario encontrado.
  - `404 Not Found`: Usuario no encontrado.
  - `500 Internal Server Error`: Error al obtener el usuario.

#### Update User by ID
- **URL:** `/users/:id`
- **Method:** `PUT`
- **Description:** Actualiza un usuario existente.
- **Parameters:**
  - `id` (URL parameter): ID del usuario.
- **Request Body:**
  - `email` (string, opcional): Email del usuario.
  - `password` (string, opcional): Contraseña del usuario.
  - `name` (string, opcional): Nombre del usuario.
  - `phone` (string, opcional): Teléfono del usuario.
  - `address` (string, opcional): Dirección del usuario.
- **Response:**
  - `200 OK`: Usuario actualizado exitosamente.
  - `404 Not Found`: Usuario no encontrado.
  - `400 Bad Request`: Error al actualizar el usuario.
  - `500 Internal Server Error`: Error en el servidor.

#### Delete User by ID
- **URL:** `/users/:id`
- **Method:** `DELETE`
- **Description:** Elimina un usuario existente.
- **Parameters:**
  - `id` (URL parameter): ID del usuario.
- **Response:**
  - `200 OK`: Usuario eliminado exitosamente.
  - `404 Not Found`: Usuario no encontrado.
  - `500 Internal Server Error`: Error al eliminar el usuario.

### Bank Endpoints

#### Get All Banks
- **URL:** `/banks`
- **Method:** `GET`
- **Description:** Obtiene todos los bancos.
- **Response:**
  - `200 OK`: Lista de bancos.
  - `500 Internal Server Error`: Error al obtener los bancos.

#### Get Bank by ID
- **URL:** `/banks/:id`
- **Method:** `GET`
- **Description:** Obtiene un banco por su ID.
- **Parameters:**
  - `id` (URL parameter): ID del banco.
- **Response:**
  - `200 OK`: Banco encontrado.
  - `404 Not Found`: Banco no encontrado.
  - `500 Internal Server Error`: Error al obtener el banco.

#### Create Bank
- **URL:** `/banks`
- **Method:** `POST`
- **Description:** Crea un nuevo banco.
- **Request Body:**
  - `name` (string): Nombre del banco.
  - `swiftCode` (string): Código SWIFT del banco.
  - `direction` (string): Dirección del banco.
  - `phone` (string): Teléfono del banco.
  - `rateType` (string): Tipo de tasa (`TNA`, `TEA`).
  - `rate` (number): Tasa del banco.
- **Response:**
  - `201 Created`: Banco creado exitosamente.
  - `400 Bad Request`: Todos los campos son obligatorios.
  - `500 Internal Server Error`: Error al guardar el banco.

#### Update Bank
- **URL:** `/banks/:id`
- **Method:** `PUT`
- **Description:** Actualiza un banco existente.
- **Parameters:**
  - `id` (URL parameter): ID del banco.
- **Request Body:**
  - `name` (string): Nombre del banco.
  - `swiftCode` (string): Código SWIFT del banco.
  - `direction` (string): Dirección del banco.
  - `phone` (string): Teléfono del banco.
  - `rateType` (string): Tipo de tasa (`TNA`, `TEA`).
  - `rate` (number): Tasa del banco.
- **Response:**
  - `200 OK`: Banco actualizado exitosamente.
  - `400 Bad Request`: Todos los campos son obligatorios.
  - `404 Not Found`: Banco no encontrado.
  - `500 Internal Server Error`: Error al actualizar el banco.

#### Delete Bank
- **URL:** `/banks/:id`
- **Method:** `DELETE`
- **Description:** Elimina un banco existente.
- **Parameters:**
  - `id` (URL parameter): ID del banco.
- **Response:**
  - `200 OK`: Banco eliminado exitosamente.
  - `404 Not Found`: Banco no encontrado.
  - `500 Internal Server Error`: Error al eliminar el banco.

#### Add Commission to Bank
- **URL:** `/banks/:id/commissions`
- **Method:** `POST`
- **Description:** Agrega una comisión a un banco.
- **Parameters:**
  - `id` (URL parameter): ID del banco.
- **Request Body:**
  - `name` (string): Nombre de la comisión.
  - `type` (string): Tipo de comisión (`PayF`, `PayE`, `Withholding`).
  - `amount` (number): Monto de la comisión.
- **Response:**
  - `200 OK`: Comisión agregada exitosamente.
  - `400 Bad Request`: Todos los campos son obligatorios.
  - `404 Not Found`: Banco no encontrado.
  - `500 Internal Server Error`: Error al agregar la comisión.

#### Update Commission of a Bank
- **URL:** `/banks/:id/commissions/:commissionId`
- **Method:** `PUT`
- **Description:** Actualiza una comisión de un banco.
- **Parameters:**
  - `id` (URL parameter): ID del banco.
  - `commissionId` (URL parameter): ID de la comisión.
- **Request Body:**
  - `name` (string): Nombre de la comisión.
  - `type` (string): Tipo de comisión (`PayF`, `PayE`, `Withholding`).
  - `amount` (number): Monto de la comisión.
- **Response:**
  - `200 OK`: Comisión actualizada exitosamente.
  - `400 Bad Request`: Todos los campos son obligatorios.
  - `404 Not Found`: Banco o comisión no encontrados.
  - `500 Internal Server Error`: Error al actualizar la comisión.

#### Delete Commission of a Bank
- **URL:** `/banks/:id/commissions/:commissionId`
- **Method:** `DELETE`
- **Description:** Elimina una comisión de un banco.
- **Parameters:**
  - `id` (URL parameter): ID del banco.
  - `commissionId` (URL parameter): ID de la comisión.
- **Response:**
  - `200 OK`: Comisión eliminada exitosamente.
  - `404 Not Found`: Banco o comisión no encontrados.
  - `500 Internal Server Error`: Error al eliminar la comisión.

### Portfolio Endpoints

#### Get All Portfolios
- **URL:** `/portfolios`
- **Method:** `GET`
- **Description:** Obtiene todos los portafolios.
- **Response:**
  - `200 OK`: Lista de portafolios.
  - `500 Internal Server Error`: Error al obtener los portafolios.

#### Get Portfolio by ID
- **URL:** `/portfolios/:id`
- **Method:** `GET`
- **Description:** Obtiene un portafolio por su ID.
- **Parameters:**
  - `id` (URL parameter): ID del portafolio.
- **Response:**
  - `200 OK`: Portafolio encontrado.
  - `404 Not Found`: Portafolio no encontrado.
  - `500 Internal Server Error`: Error al obtener el portafolio.

#### Create Portfolio
- **URL:** `/portfolios`
- **Method:** `POST`
- **Description:** Crea un nuevo portafolio.
- **Request Body:**
  - `name` (string): Nombre del portafolio.
  - `state` (string): Estado del portafolio.
- **Response:**
  - `201 Created`: Portafolio creado exitosamente.
  - `500 Internal Server Error`: Error al crear el portafolio.

#### Update Portfolio
- **URL:** `/portfolios/:id`
- **Method:** `PUT`
- **Description:** Actualiza un portafolio existente.
- **Parameters:**
  - `id` (URL parameter): ID del portafolio.
- **Request Body:**
  - `name` (string, opcional): Nombre del portafolio.
  - `state` (string, opcional): Estado del portafolio.
- **Response:**
  - `200 OK`: Portafolio actualizado exitosamente.
  - `404 Not Found`: Portafolio no encontrado.
  - `500 Internal Server Error`: Error al actualizar el portafolio.

#### Calculate TCEA for Portfolio
- **URL:** `/portfolios/:id/tcea`
- **Method:** `PUT`
- **Description:** Calcula el TCEA para un portafolio.
- **Parameters:**
  - `id` (URL parameter): ID del portafolio.
- **Request Body:**
  - `bankId` (string): ID del banco.
  - `dateTcea` (date): Fecha para el cálculo del TCEA.
- **Response:**
  - `200 OK`: TCEA calculado exitosamente.
  - `404 Not Found`: Portafolio no encontrado.
  - `500 Internal Server Error`: Error al calcular el TCEA.

#### Delete Portfolio
- **URL:** `/portfolios/:id`
- **Method:** `DELETE`
- **Description:** Elimina un portafolio existente.
- **Parameters:**
  - `id` (URL parameter): ID del portafolio.
- **Response:**
  - `200 OK`: Portafolio eliminado exitosamente.
  - `404 Not Found`: Portafolio no encontrado.
  - `500 Internal Server Error`: Error al eliminar el portafolio.

### Invoice Bill Endpoints

#### Get All Invoice Bills
- **URL:** `/invoiceBills`
- **Method:** `GET`
- **Description:** Obtiene todas las facturas.
- **Response:**
  - `200 OK`: Lista de facturas.
  - `500 Internal Server Error`: Error al obtener las facturas.

#### Get Invoice Bill by ID
- **URL:** `/invoiceBills/:id`
- **Method:** `GET`
- **Description:** Obtiene una factura por su ID.
- **Parameters:**
  - `id` (URL parameter): ID de la factura.
- **Response:**
  - `200 OK`: Factura encontrada.
  - `404 Not Found`: Factura no encontrada.
  - `500 Internal Server Error`: Error al obtener la factura.

#### Get Invoice Bills by Portfolio ID
- **URL:** `/portfolio/:id/invoiceBills`
- **Method:** `GET`
- **Description:** Obtiene todas las facturas de un portafolio por su ID.
- **Parameters:**
  - `id` (URL parameter): ID del portafolio.
- **Response:**
  - `200 OK`: Lista de facturas del portafolio.
  - `404 Not Found`: No se encontraron facturas para el portafolio proporcionado.
  - `500 Internal Server Error`: Error al obtener las facturas.

#### Create Invoice Bill
- **URL:** `/invoiceBills`
- **Method:** `POST`
- **Description:** Crea una nueva factura.
- **Request Body:**
  - `portfolioId` (string): ID del portafolio.
  - `invoiceBillNumber` (string): Número de la factura.
  - `type` (string): Tipo de documento (`Invoice`, `Bill`).
  - `amount` (number): Monto de la factura.
  - `currency` (string): Moneda de la factura (`USD`, `PEN`).
  - `issueDate` (date): Fecha de emisión de la factura.
  - `expirationDate` (date): Fecha de vencimiento de la factura.
  - `state` (string): Estado de la factura (`Pending`, `Payte`, `Expired`).
- **Response:**
  - `201 Created`: Factura creada exitosamente.
  - `500 Internal Server Error`: Error al crear la factura.

#### Update Invoice Bill
- **URL:** `/invoiceBills/:id`
- **Method:** `PUT`
- **Description:** Actualiza una factura existente.
- **Parameters:**
  - `id` (URL parameter): ID de la factura.
- **Request Body:**
  - `portfolioId` (string, opcional): ID del portafolio.
  - `invoiceBillNumber` (string, opcional): Número de la factura.
  - `type` (string, opcional): Tipo de documento (`Invoice`, `Bill`).
  - `amount` (number, opcional): Monto de la factura.
  - `currency` (string, opcional): Moneda de la factura (`USD`, `PEN`).
  - `issueDate` (date, opcional): Fecha de emisión de la factura.
  - `expirationDate` (date, opcional): Fecha de vencimiento de la factura.
  - `state` (string, opcional): Estado de la factura (`Pending`, `Payte`, `Expired`).
- **Response:**
  - `200 OK`: Factura actualizada exitosamente.
  - `404 Not Found`: Factura no encontrada.
  - `500 Internal Server Error`: Error al actualizar la factura.

#### Delete Invoice Bill
- **URL:** `/invoiceBills/:id`
- **Method:** `DELETE`
- **Description:** Elimina una factura existente.
- **Parameters:**
  - `id` (URL parameter): ID de la factura.
- **Response:**
  - `200 OK`: Factura eliminada exitosamente.
  - `404 Not Found`: Factura no encontrada.
  - `500 Internal Server Error`: Error al eliminar la factura.