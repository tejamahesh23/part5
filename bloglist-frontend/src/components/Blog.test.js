import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
    const blog = {
        title: 'React',
        author: 'University Of Helsinki',
        likes: 20,
        url: 'https://fullstackopen.com/en',
        user: {
            name: 'Some name'
        }
    }

    const component = render(
        <Blog blog={blog} />
    )

    const blogView = component.container.querySelector('.blog-default')
    expect(blogView).toHaveTextContent('React')
    expect(blogView).toHaveTextContent('University Of Helsinki')

})

test('clicking the button displays likes and url', () => {
    const blog = {
        title: 'React',
        author: 'University Of Helsinki',
        likes: 20,
        url: 'https://fullstackopen.com/en',
        user: {
            name: 'Some name'
        }
    }

    const component = render(
        <Blog blog={blog} />
    )

    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent('https://fullstackopen.com/en')
})

/*test('clicking like button twice', () => {
    const blog = {
        title: 'React',
        author: 'University Of Helsinki',
        likes: 20,
        url: 'https://fullstackopen.com/en',
        user: {
            name: 'Some name'
        }
    }

    const mockHandler = jest.fn()

    const component = render(
        <Blog blog={blog} updateLikeCount={mockHandler} />
    )

    // component.debug()

    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)
    expect(mockHandler.mock.calls.length).toBe(2)
})*/