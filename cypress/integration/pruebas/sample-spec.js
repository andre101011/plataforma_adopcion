/**
 * Accede a la pagina
 */

describe("Pagina principal", () => {
  it("ir a la pagina principal", () => {
    cy.visit("/");
  });
});
/**
 * Se logguea como lo haría un usuario
 *
 */
describe("La pagina de login", () => {
  context("Startup", () => {
    beforeEach(() => {
      cy.visit("/employees/login");
    });

    it("loggearse", () => {
      // Fill the username
      cy.get('input[name="email"]')
        .type("nfigueroasan@gmail.com")
        .should("have.value", "nfigueroasan@gmail.com");

      // Fill the password
      cy.get('input[name="password"]')
        .type("1234567")
        .should("have.value", "1234567");

      // Locate and submit the form
      cy.get('button[name="ingresar"]').click();

      cy.url().should("include", "/animals");
    });
  });
});

describe("Agregar un empleado ", () => {
  context("Startup", () => {
    beforeEach(() => {
      cy.visit("/employees/login");

      cy.request("POST", "/employees/login", {
        email: "nfigueroasan@gmail.com",
        password: "1234567",
      });

      cy.visit("/animals");
      cy.url().should("include", "/animals");
    });

    it("Ir a agregar y agregar", () => {
      cy.visit("/employees/add");

      // Fill the username
      cy.get('input[name="nombre"]')
        .type("cipress1")
        .should("have.value", "cipress1");

      // Fill the password
      cy.get('input[name="email"]')
        .type("test1@gmail.com")
        .should("have.value", "test1@gmail.com");

      cy.get('input[name="cedula"]')
        .type("423637484")
        .should("have.value", "423637484");

      cy.get('input[name="password"]')
        .type("12345678")
        .should("have.value", "12345678");

      cy.get('input[name="passwordConfirm"]')
        .type("12345678")
        .should("have.value", "12345678");

      // Locate and submit the form
      cy.get('button[name="submit"]').click();

  

      cy.url().should("include", "/employess/list");
    });
  });
});

describe("Buscar Animal", () => {
  context("Startup", () => {
    beforeEach(() => {
      cy.visit("/employees/login");
    });

    it("loggearse sin ui", () => {
      cy.request("POST", "/employees/login", {
        email: "nfigueroasan@gmail.com",
        password: "1234567",
      });
      cy.visit("/animals");

      cy.url().should("include", "/animals");
    });
  });
});

describe("Crear Proceso de adopcón ", () => {
  context("Startup", () => {
    beforeEach(() => {
      cy.visit("/employees/login");
    });

    it("loggearse sin ui", () => {
      cy.request("POST", "/employees/login", {
        email: "nfigueroasan@gmail.com",
        password: "1234567",
      });
      cy.visit("/animals");

      cy.url().should("include", "/animals");
    });

    it("crear Proceso", () => {
      cy.request("POST", "/employees/login", {
        email: "nfigueroasan@gmail.com",
        password: "1234567",
      });
      cy.visit("/animals");

      cy.url().should("include", "/animals");
    });
  });
});

describe("Registrar Animal ", () => {
  context("Startup", () => {
    beforeEach(() => {
      cy.visit("/employees/login");
    });

    it("loggearse sin ui", () => {
      cy.request("POST", "/employees/login", {
        email: "nfigueroasan@gmail.com",
        password: "1234567",
      });
      cy.visit("/animals");

      cy.url().should("include", "/animals");
    });

    it("Registrar animal", () => {
      cy.request("POST", "/employees/login", {
        email: "nfigueroasan@gmail.com",
        password: "1234567",
      });
      cy.visit("/animals");

      cy.url().should("include", "/animals");
    });
  });
});
