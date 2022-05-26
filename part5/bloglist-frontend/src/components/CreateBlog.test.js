import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CreateBlog from './CreateBlog'
import userEvent from '@testing-library/user-event'

test('check, that the form calls the event handler with right details', async () => {

  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(
    <CreateBlog createBlog={createBlog} />
  )

  const inputTitle = screen.getByPlaceholderText('Title')
  const inputAuthor = screen.getByPlaceholderText('Author')
  const inputUrl = screen.getByPlaceholderText('URL')

  const addButton = screen.getByText('add')

  await user.type(inputTitle, 'Walblog')
  await user.type(inputAuthor, 'Hans')
  await user.type(inputUrl, 'walblog.de')
  await user.click(addButton)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0]['author']).toBe('Hans')
  expect(createBlog.mock.calls[0][0]['title']).toBe('Walblog')
  expect(createBlog.mock.calls[0][0]['url']).toBe('walblog.de')

})

test()