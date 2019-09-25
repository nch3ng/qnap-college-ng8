context('Course without login', () => {
  beforeEach(() => {
    cy.fixture('courses.json').as('coursesJSON');
    cy.fixture('categories.json').as("categoriesJSON");
    cy.server();
    cy.get('@coursesJSON').then((courses) => {
      const tPages = courses.docs.length/6 
      for ( let i = 0; i < tPages; i++ ) {
        cy.route('http://localhost:3000/api/courses?orderBy=publishedDate:desc&limit=6&page='+i,
      { docs: courses.docs.slice((i*6)+i, (i*6)+i+6), page: i,  total_pages: courses.docs.length/6 });
      }
    });

    cy.route('http://localhost:3000/api/categories',
    'fixture:categories.json');

    cy.route(' http://localhost:3000/api/check-state', {"success":false,"message":"No token provided","status":401}).as('checkState');
    cy.visit('https://localhost:4200');
  })

  it('should go to a course page', function() {
    const course = this.coursesJSON.docs.filter((c) => {
      return c.slug === 'how-to-convert-a-thick-volume-to-a-thin-volume';
    })[0];

    cy.route('http://localhost:3000/api/courses/s/how-to-convert-a-thick-volume-to-a-thin-volume', course);
    cy.get('.video-item').first()
      .get('.video-card-content').first()
      .click();
  })
})