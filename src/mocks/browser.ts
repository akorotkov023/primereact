import { setupWorker } from 'msw/browser';
// @ts-ignore
import { http, HttpResponse } from "msw";

let allRecords = new Map()

allRecords.set(1, {id: 1, date: '2024-10-27T18:00', temperature: 'Алексей', weather: 'Дождливо', userName: "Андрей", comment: ''});
allRecords.set(2, {id: 2, date: '2024-10-28T18:00', temperature: 'Петр', weather: 'Солнечно', userName: "Петр", comment: ''});

const worker = setupWorker(
    http.get('/api/users', () => {
        return HttpResponse.json([
            { name: 'Алексей', value: 'Алексей' },
            { name: 'Мария', value: 'Мария' },
            { name: 'Петр', value: 'Петр' },
        ]);
    }),
    http.get('/api/weather', () => {
        return HttpResponse.json(Array.from(allRecords.values()))
    }),
    http.post('/api/weather', async ({ request }) => {
        let newRec = await request.json()
        const currentValue = Array.from(allRecords.keys());
        const maxCurrentValue = Math.max(...currentValue)
        // @ts-ignore
        newRec.id = maxCurrentValue + 1;
        // @ts-ignore
        allRecords.set(Number(maxCurrentValue + 1), newRec)

        return HttpResponse.json(newRec, { status: 201 })
    }),
    http.delete('/api/weather/:id', ({ params }) => {
        const { id } = params
        const deletedRec = allRecords.get(Number(id))

        console.log('/api/weather deletedRec', deletedRec)

        if (!deletedRec) {
            return new HttpResponse(null, { status: 404 })
        }
        allRecords.delete(Number(id))

        console.log('/api/weather', allRecords)

        return HttpResponse.json(deletedRec)
    })
);

export { worker };
