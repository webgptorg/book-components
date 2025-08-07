import TextareaWithCounter from '@/components/textarea-with-counter/TextareaWithCounter';

export default function PlaygroundPage() {
    return (
        <div>
            <TextareaWithCounter placeholder="Start typing..." maxLength={500} rows={4} className="mb-4" />
        </div>
    );
}
