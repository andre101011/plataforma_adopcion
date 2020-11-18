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
