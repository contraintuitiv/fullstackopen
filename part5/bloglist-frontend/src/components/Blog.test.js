import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blogDummy = () => ({
  'url' : 'bla',
  'author' : 'Anderer',
  'title' : 'Das ist ein Blogtitel'
})

test('renders content', () => {
  const blog = blogDummy()

  render(<Blog blog={blog} />)

  const element = screen.getByText('Das ist ein Blogtitel')
  // screen.debug(element)
  expect(element).toBeDefined()
})

test('detail content only shown after click', async () => {
  const blog = blogDummy()

  const { container } = render(<Blog blog={blog} />)

  const element = container.querySelector('.togglableContent')
  expect(element).toHaveStyle('display: none')
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  expect(element).not.toHaveStyle('display: none')
  expect(await screen.findByText('likes:')).toBeVisible()
})

test('clicking like-button calls every time mock', async () => {
  const blog = blogDummy()

  const mockHandler = jest.fn()

  render(
    <Blog blog={blog} likeBlog={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
