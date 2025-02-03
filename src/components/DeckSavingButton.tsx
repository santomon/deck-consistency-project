import {useEffect, useState } from "react";
import {NUMBER_OF_SAVE_SLOTS} from "~/constants";
import {TotalStore, TotalStoreSchema} from "~/types";

const DataStorageButton: React.FC = () => {
    // State to control dialog visibility
    const [isOpen, setIsOpen] = useState<boolean>(false);
    // State for the input name when saving
    const [slotName, setSlotName] = useState<string>('');
    // State for the selected slot (1 to 10) for saving
    const [selectedSlot, setSelectedSlot] = useState<number>(1);
    // State for loaded saved slots (refresh on changes)
    const [savedSlots, setSavedSlots] = useState<
        { key: string; name: string; data: any }[]
    >([]);

    // Example data that you want to save
    const exampleData = { foo: 'bar', timestamp: Date.now() };

    // Function to construct localStorage key
    const getSlotKey = (slot: number): string => `deck-consistency-${slot}`;

    // Function to load all slots from localStorage
    const loadSlots = () => {
        const slots: { key: string; name: string; data: TotalStore  }[] = [];
        for (let i = 1; i <= NUMBER_OF_SAVE_SLOTS; i++) {
            const key = getSlotKey(i);
            const item = localStorage.getItem(key);
            if (item) {
                try {
                    const parsed = TotalStoreSchema.parse(JSON.parse(item));

                    slots.push({ key, name: parsed.name, data: parsed.data });
                } catch (err) {
                    console.error(`Error parsing localStorage for key ${key}:`, err);
                }
            } else {
                slots.push({ key, name: '', data: null });
            }
        }
        setSavedSlots(slots);
    };

    // Load saved slots whenever the dialog is opened
    useEffect(() => {
        if (isOpen) {
            loadSlots();
        }
    }, [isOpen]);

    // Function to handle saving data to a slot
    const handleSave = () => {
        const key = getSlotKey(selectedSlot);
        const value = JSON.stringify({ name: slotName, data: exampleData });
        localStorage.setItem(key, value);
        loadSlots(); // refresh the saved slots
        alert(`Saved to slot ${selectedSlot} with name "${slotName}" 😊`);
    };

    // Function to handle loading data from a given slot
    const handleLoad = (slot: number) => {
        const key = getSlotKey(slot);
        const item = localStorage.getItem(key);
        if (item) {
            try {
                const parsed = JSON.parse(item);
                alert(`Loaded slot ${slot}: ${JSON.stringify(parsed)}`);
            } catch (err) {
                console.error(`Error parsing localStorage for key ${key}:`, err);
                alert('Error loading data 😓');
            }
        } else {
            alert(`Slot ${slot} is empty.`);
        }
    };

    return (
        <div className="p-4">
            {/* Button to open the dialog */}
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Open Data Storage
            </button>

            <DialogBox isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Save / Load Data</h2>

                {/* Save Section */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Save Data</h3>
                    <div className="mb-2">
                        <label className="block mb-1">Slot (1-10):</label>
                        <select
                            value={selectedSlot}
                            onChange={(e) => setSelectedSlot(parseInt(e.target.value))}
                            className="w-full border px-2 py-1 rounded"
                        >
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((slot) => (
                                <option key={slot} value={slot}>
                                    {slot}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-2">
                        <label className="block mb-1">Name for Save:</label>
                        <input
                            type="text"
                            value={slotName}
                            onChange={(e) => setSlotName(e.target.value)}
                            placeholder="Enter name"
                            className="w-full border px-2 py-1 rounded"
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        className="mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                        Save Data
                    </button>
                </div>

                {/* Load Section */}
                <div>
                    <h3 className="font-semibold mb-2">Load Data</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {savedSlots.map((slot, index) => (
                            <div key={slot.key} className="border p-2 rounded">
                                <p className="font-medium">
                                    Slot {index + 1}:{' '}
                                    {slot.name ? (
                                        <span className="text-green-600">{slot.name}</span>
                                    ) : (
                                        <span className="text-gray-500">Empty</span>
                                    )}
                                </p>
                                <button
                                    onClick={() => handleLoad(index + 1)}
                                    className="mt-1 bg-blue-400 text-white py-1 px-2 rounded hover:bg-blue-500 w-full"
                                >
                                    Load
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogBox>
        </div>
    );
};

export default DataStorageButton;