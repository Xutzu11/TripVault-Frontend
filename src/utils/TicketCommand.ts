import axios from 'axios';

export interface TicketCommand {
    execute(): void;
}

export class ValidateTicketCommand implements TicketCommand {
    constructor(
        private ticketId: string,
        private onDone: () => void,
    ) {}

    execute() {
        axios
            .put(
                `/api/ticket/validate/${this.ticketId}`,
                {},
                {
                    headers: {Authorization: localStorage.getItem('token')},
                },
            )
            .then(() => {
                console.log('Ticket validated.');
                this.onDone();
            })
            .catch((error) => {
                console.error('Validate failed:', error);
                this.onDone();
            });
    }
}

export class RejectTicketCommand implements TicketCommand {
    constructor(
        private ticketId: string,
        private onDone: () => void,
    ) {}

    execute() {
        axios
            .put(
                `/api/ticket/expire/${this.ticketId}`,
                {},
                {
                    headers: {Authorization: localStorage.getItem('token')},
                },
            )
            .then(() => {
                console.log('Ticket rejected.');
                this.onDone();
            })
            .catch((error) => {
                console.error('Reject failed:', error);
                this.onDone();
            });
    }
}

export class PassTicketCommand implements TicketCommand {
    constructor(private onDone: () => void) {}

    execute() {
        console.log('Ticket passed.');
        this.onDone();
    }
}
