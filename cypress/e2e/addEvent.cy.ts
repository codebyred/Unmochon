describe('template spec', () => {
  
  it('Create adds a new event', () => {

    cy.visit('/events');

    // Click on the Add Item Card using the data-cy attribute
    cy.get('[data-cy="add-event-card"]').click();

    // Verify that we are on the /events/add page
    cy.url().should("include", "/events/add");    

    cy.get('[data-cy="eventName"]').type("Database management system");

    cy.get('[data-cy="registration-date-btn"]').click();

    // select date

    const today = new Date();
    const registrationDate = today.getDate() + 2;
    const projectSubMissionDate = today.getDate() + 4
    

    cy.get('button[name="day"]').contains(`${registrationDate}`).click();

    cy.get('[data-cy="requirements"]').type("mysql, php, html");

    cy.get('[data-cy="projectSubmission-date-btn"]').click();

    cy.get('button[name="day"]').contains(`${projectSubMissionDate}`).click();

    cy.get('[data-cy="addEvent-btn"]').click();

    cy.url().should("include", "/events");
    

  })
})