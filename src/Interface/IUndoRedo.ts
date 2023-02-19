export interface IUndoRedo {
    /**
     * Undo the last action
     */
    undo(): void;

    /**
     * Redo the last action if possible
     */
    redo(): void;

    /**
     * Create a new snapshot
     */
    createSnapshot(): void;

    /**
     * Remove the oldest snapshot.
     */
    shiftSnapshot(): void;
}
