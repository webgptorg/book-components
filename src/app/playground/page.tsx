import BookEditor from '@/components/book-editor/BookEditor';

export default function PlaygroundPage() {
    return (
        <div>
            <BookEditor placeholder="Start writing your book..." rows={8} className="mb-4" />
        </div>
    );
}
