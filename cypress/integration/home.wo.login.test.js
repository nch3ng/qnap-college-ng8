context('Home without login', () => {
  let courses;

  before(() => {
  });
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
  });

  it('visits home with 6 videos and 5 categories in defaults', () => {
    
    cy.contains('Welcome to QNAP College');
    cy.get('.video-item').should('have.length', 6);
    cy.get('.category-item').should('have.length', 5);
  });

  it('scroll down in home page', () => {
    cy.scrollTo('bottom');
    cy.wait(500);
    cy.get('.video-item').should('have.length', 12);
    cy.scrollTo('bottom');
    cy.wait(500);
    cy.get('.video-item').should('have.length', 18);
    cy.scrollTo('bottom');
    cy.wait(500);
    cy.get('.video-item').should('have.length', 24);
    cy.scrollTo('bottom');
    cy.wait(500);
    cy.get('.video-item').should('have.length', 30);
  });

  it('should show 3 columns when click grid 3 icon and vice versa', () => {
    cy.get('.fa-th').click();
    cy.wait(500);
    cy.get('.col-md-4').its('length').should('be.gt', 0);
    cy.get('.col-md-5').should('have.length', 0)
    cy.get('.fa-th-large').click();
    cy.wait(500);
    cy.get('.col-md-5').its('length').should('be.gt', 0);
    cy.get('.col-md-4').should('have.length', 0)
  });

  it('search with keywords', function () {
    const results = this.coursesJSON.docs.filter(c => {
      const text = c.title + ' ' + c.keywords + ' ' + c.desc;
      if (text.includes('backup')) {
        return true;
      } 
    });
    cy.route(' http://localhost:3000/api/courses/**/youtubeinfo', {}).as('getYoutubeInfo');
    cy.route(' http://localhost:3000/api/courses/search?query=backup', results).as('getSearch');

    cy.get('#search_input')
      .type('backup').should('have.value', 'backup');
    cy.get('.search-input').submit();
    cy.wait('@getSearch');
    cy.contains('Videos of Search Result');
    cy.get('.video-item').should('have.length', results.length);
  });

  it('should show courses of a category when click a category', function() {
    cy.route('http://localhost:3000/api/category/webinar/clicked', {});
    cy.route(' http://localhost:3000/api/courses/**/youtubeinfo', {}).as('getYoutubeInfo');
    const results = this.coursesJSON.docs.filter(c => {
      if (c.category.toLowerCase() === 'webinar') {
        return true;
      } 
    });

    cy.route('http://localhost:3000/api/category/webinar/courses', results);
    cy.get('.webinar').click();
    cy.contains('Category of Webinar');
    cy.get('.video-item').should('have.length', results.length);
  
  });
});