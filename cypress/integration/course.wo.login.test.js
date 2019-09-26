context('Course without login', function() {
  let side_courses;
  beforeEach(function() {
    cy.fixture('courses.json').as('coursesJSON');
    cy.fixture('categories.json').as("categoriesJSON");
    cy.server();
    cy.get('@coursesJSON').then((courses) => {
      const tPages = courses.docs.length/6 
      for ( let i = 0; i < tPages; i++ ) {
        cy.route('http://localhost:3000/api/courses?orderBy=publishedDate:desc&limit=6&page='+i,
      { docs: courses.docs.slice((i*6)+i, (i*6)+i+6), page: i,  total_pages: courses.docs.length/6 });
      }

      const sorted_courses = courses.docs.sort((a, b) => b.watched - a.watched);
      side_courses = sorted_courses.slice(0,4);
      cy.route('http://localhost:3000/api/courses?orderBy=watched:desc&limit=4&page=1', { docs: side_courses });
    });
    

    cy.route('http://localhost:3000/api/categories',
    'fixture:categories.json');

    cy.route(' http://localhost:3000/api/check-state', {"success":false,"message":"No token provided","status":401}).as('checkState');
    cy.route('POST', 'http://localhost:3000/api/courses/**/clicked', {});
    cy.route('http://localhost:3000/api/favorites/is/**', { "success":false,"message":"No token provided","status":401 })
    cy.route('http://localhost:3000/api/comments/course/**', []);
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

    cy.contains(course.title);
    cy.get('.media-object').should('have.length', side_courses.length);
    cy.contains('Search Videos');
    cy.get('.input-keywords').should('exist');
  });
})