describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'Ashna',
            username: 'ashna111',
            password: 'fullstack'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function () {
        cy.contains('Log in')
        cy.contains('username')
        cy.contains('password')
    })

    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.get("#username").type("ashna111")
            cy.get("#password").type("fullstack")
            cy.get("#login-button").click()
            cy.contains("Ashna is logged in")
        })

        it('fails with wrong credentials', function () {
            cy.get("#username").type("ashna111")
            cy.get("#password").type("fullstack1")
            cy.get("#login-button").click()
            cy.contains("Wrong credentials")
        })
    })

    describe.only("When logged in", function () {
        beforeEach(function () {
            cy.request('POST', 'http://localhost:3001/api/login', {
                username: 'ashna111', password: 'fullstack'
            }).then(response => {
                localStorage.setItem('loggedBlogAppUser', JSON.stringify(response.body))
                cy.visit('http://localhost:3000')
            })
        })

        it("a new blog can be created", function () {
            cy.contains("new blog").click()

            cy.get("#title").type("Test Title")
            cy.get("#author").type("Test Author")
            cy.get("#url").type("Test URL")
            cy.get("#create-blog").click()

            cy.contains("Test Title")
        })

        it("user can like a blog", function () {
            cy.contains("new blog").click()

            cy.get("#title").type("Test Title")
            cy.get("#author").type("Test Author")
            cy.get("#url").type("Test URL")
            cy.get("#create-blog").click()

            cy.contains("Test Title")
            cy.contains("view").click()
            cy.contains("like").click()
            cy.contains(1)
        })

        it("user can delete blog", function () {
            cy.contains("new blog").click()

            cy.get("#title").type("Test Title")
            cy.get("#author").type("Test Author")
            cy.get("#url").type("Test URL")
            cy.get("#create-blog").click()

            cy.contains("Test Title")
            cy.contains("view").click()
            cy.contains("remove").click()
        })

        it("order of blogs", function () {
            cy.contains("new blog").click()

            cy.get("#title").type("Test Title 1")
            cy.get("#author").type("Test Author 1")
            cy.get("#url").type("Test URL 1")
            cy.get("#create-blog").click()

            cy.contains("view").click()
            cy.contains("like").click()
            cy.contains("hide").click()

            cy.get("#title").type("Test Title 2")
            cy.get("#author").type("Test Author 2")
            cy.get("#url").type("Test URL 2")
            cy.get("#create-blog").click()

            cy.get(".blog").then(blogs => {
                cy.wrap(blogs[0])
            })

        })
    })
})