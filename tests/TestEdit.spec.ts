import {expect, test} from '@playwright/test';

test('Test Edit', async ({page}) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', {name: 'Edit'}).first().click();
    const oldName = await page.getByPlaceholder('Name...').inputValue();
    const oldLocation = await page.getByPlaceholder('Location...').inputValue();
    const oldRevenue = await page.getByPlaceholder('Revenue...').inputValue();

    await page.getByPlaceholder('Name...').click();
    await page.getByPlaceholder('Name...').fill('');
    await page.getByPlaceholder('Location...').click();
    await page.getByPlaceholder('Location...').fill('dsfgsdg');
    await page.getByPlaceholder('Revenue...').click();
    await page.getByPlaceholder('Revenue...').fill('4343');
    await page.getByRole('button', {name: 'Save'}).click();
    await expect(page.getByPlaceholder('Name...')).toHaveValue(oldName);
    await expect(page.getByPlaceholder('Location...')).toHaveValue(oldLocation);
    await expect(page.getByPlaceholder('Revenue...')).toHaveValue(oldRevenue);


    await page.getByPlaceholder('Name...').click();
    await page.getByPlaceholder('Name...').fill('ewewfw');
    await page.getByPlaceholder('Location...').click();
    await page.getByPlaceholder('Location...').fill('');
    await page.getByPlaceholder('Revenue...').click();
    await page.getByPlaceholder('Revenue...').fill('2234');
    await page.getByRole('button', {name: 'Save'}).click();
    await expect(page.getByPlaceholder('Name...')).toHaveValue(oldName);
    await expect(page.getByPlaceholder('Location...')).toHaveValue(oldLocation);
    await expect(page.getByPlaceholder('Revenue...')).toHaveValue(oldRevenue);

    await page.getByPlaceholder('Name...').click();
    await page.getByPlaceholder('Name...').fill('abcdef');
    await page.getByPlaceholder('Location...').click();
    await page.getByPlaceholder('Location...').fill('ghijl');
    await page.getByPlaceholder('Revenue...').click();
    await page.getByPlaceholder('Revenue...').fill('-4343');
    await page.getByRole('button', {name: 'Save'}).click();
    await expect(page.getByPlaceholder('Name...')).toHaveValue(oldName);
    await expect(page.getByPlaceholder('Location...')).toHaveValue(oldLocation);
    await expect(page.getByPlaceholder('Revenue...')).toHaveValue(oldRevenue);

    await page.getByPlaceholder('Name...').click();
    await page.getByPlaceholder('Name...').fill('aeiou');
    await page.getByPlaceholder('Location...').click();
    await page.getByPlaceholder('Location...').fill('xyz');
    await page.getByPlaceholder('Revenue...').click();
    await page.getByPlaceholder('Revenue...').fill('12345');
    await page.getByRole('button', {name: 'Save'}).click();
    await expect(page.getByPlaceholder('Name...')).toHaveValue('aeiou');
    await expect(page.getByPlaceholder('Location...')).toHaveValue('xyz');
    await expect(page.getByPlaceholder('Revenue...')).toHaveValue('12345');
});
