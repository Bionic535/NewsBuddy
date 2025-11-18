import { test, expect, beforeEach } from 'vitest';
import { getMainTextFromHtml, aiCall ,apiImageCall } from './openai.js';


test('getMainTextFromHtml extracts text from <main>', async () => {
  const html = `<html><body><main>This is the main content.</main><footer>Footer content.</footer></body></html>`;
  const text = await getMainTextFromHtml(html);
  expect(text).toBe('This is the main content.');
});

test('getMainTextFromHtml falls back to <article>', async () => {
  const html = `<html><body><article>This is the article content.</article><footer>Footer content.</footer></body></html>`;
  const text = await getMainTextFromHtml(html);
  expect(text).toBe('This is the article content.');
});


test('getMainTextFromHtml falls back to <body>', async () => {
  const html = `<html><body>This is the body content.<footer>Footer content.</footer></body></html>`;
  const text = await getMainTextFromHtml(html);
  expect(text).toBe('This is the body content.Footer content.');
});
