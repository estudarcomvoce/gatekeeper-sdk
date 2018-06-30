"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const utils_1 = require("../utils");
const services_1 = require("../services");
const interceptors_1 = require("./interceptors");
const storage_1 = require("../utils/storage");
class Session {
    constructor(options) {
        this.options = options;
        this._interceptors = [];
        this.observable = new utils_1.Observable();
        this.storage = options.storage || new utils_1.StorageUtil('session', new storage_1.LocalStorage(window));
        // Prepare session interceptors
        this._interceptors = [
            new interceptors_1.SessionCredentialsInterceptor(this),
            new interceptors_1.SessionUnauthorizedInterceptor(() => this.destroy()),
        ];
        // TODO: Service instance or config are required, validate this
        this.oauthWebService = options.oauthWebService || services_1.OAuthWebService.getInstance(Object.assign({}, options.oauth));
        this.userWebService = options.userWebService || services_1.UserWebService.getInstance(Object.assign({ session: this }, options.http));
        // Fetch session in startup by default
        if (options.autoFetch !== false) {
            this.fetch();
        }
    }
    /**
     * Gets the sesison interceptors for authorized calls and auto session destruction.
     */
    interceptors() {
        return this._interceptors;
    }
    /**
     * Gets session singleton instance.
     *
     * @param options The session options
     */
    static getInstance(options) {
        if (!this.instance) {
            this.instance = new Session(options);
        }
        return this.instance;
    }
    /**
     * Subscribe for updates.
     *
     * @param {Observer} observable The instace to be notified
     */
    subscribe(observable) {
        this.observable.subscribe(observable);
    }
    /**
     * Unsubscribe from updates.
     *
     * @param {Observer} observable The instance to be removed from listeners
     */
    unsubscribe(observable) {
        this.observable.unsubscribe(observable);
    }
    /**
     * Registers a new user in session, notifying all observers.
     *
     * @param user The user instance
     * @param {{notify: boolean}} options The operation options
     */
    register(user, options = { notify: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.current = user;
            // Save in local storage
            yield this.storage.put('session', this.current);
            // At last, notify observers of this change
            if (!options || (options && options.notify)) {
                yield this.observable.notify(Session.EVENT_SESSION_CHANGED, this.current);
            }
            return this.current;
        });
    }
    /**
     * Fetches the currently stored session.
     */
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            this.current = yield this.storage.get('session');
            yield this.observable.notify(Session.EVENT_SESSION_CHANGED, this.current);
            return this.current;
        });
    }
    /**
     * Destroys the session and clears the storage.
     */
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            this.current = undefined;
            // Destroys in local storage
            yield this.storage.clear();
            // At last, notify observers of this change
            yield this.observable.notify(Session.EVENT_SESSION_CHANGED, this.current);
            if (this.current) {
                // Revokes the token in the OAuth Server
                try {
                    yield this.oauthWebService.revoke(this.current.credentials.accessToken);
                }
                catch (exception) {
                    console.warn('SESSION: Could not destroy current session', exception);
                }
            }
            return this.current;
        });
    }
    /**
     * Performs a "password" authentication using the OAuth 2.0 server and registers it in current session.
     *
     * @param data The user credentials
     */
    password(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const oauth = yield this.oauthWebService.password(data);
            if (oauth.accessToken) {
                try {
                    const user = yield this.userWebService.me(oauth);
                    return this.register(new models_1.User(Object.assign({}, user, { credentials: oauth })));
                }
                catch (error) {
                    error.credentials = oauth;
                    throw error;
                }
            }
            throw oauth;
        });
    }
    /**
     * Performs a "client_credentials" authentication using the OAuth 2.0 server and registers it in current session.
     */
    clientCredentials() {
        return __awaiter(this, void 0, void 0, function* () {
            const oauth = yield this.oauthWebService.clientCredentials();
            try {
                if (oauth.accessToken && !oauth.virtual) {
                    const user = yield this.userWebService.me(oauth);
                    return this.register(user);
                }
                if (oauth.accessToken) {
                    return this.register(new models_1.User({ id: oauth.userId, credentials: oauth }));
                }
            }
            catch (error) {
                error.credentials = oauth;
                throw error;
            }
            throw oauth;
        });
    }
}
Session.EVENT_SESSION_CHANGED = 'SESSION_CHANGED';
exports.default = Session;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9zZXNzaW9uL1Nlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHNDQUFpQztBQUVqQyxvQ0FBNkQ7QUFDN0QsMENBQXNGO0FBQ3RGLGlEQUErRjtBQUMvRiw4Q0FBZ0Q7QUFXaEQ7SUFZRSxZQUFtQixPQUF1QjtRQUF2QixZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQU4xQyxrQkFBYSxHQUFzQixFQUFFLENBQUM7UUFPcEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLGtCQUFVLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxtQkFBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLHNCQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUV2RiwrQkFBK0I7UUFDL0IsSUFBSSxDQUFDLGFBQWEsR0FBRztZQUNuQixJQUFJLDRDQUE2QixDQUFDLElBQUksQ0FBQztZQUN2QyxJQUFJLDZDQUE4QixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUN6RCxDQUFDO1FBRUYsK0RBQStEO1FBQy9ELElBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLGVBQWUsSUFBSSwwQkFBZSxDQUFDLFdBQVcsbUJBQU0sT0FBTyxDQUFDLEtBQUssRUFBRyxDQUFDO1FBQ3BHLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsSUFBSSx5QkFBYyxDQUFDLFdBQVcsaUJBQUcsT0FBTyxFQUFFLElBQUksSUFBSyxPQUFPLENBQUMsSUFBSSxFQUFHLENBQUM7UUFFL0csc0NBQXNDO1FBQ3RDLElBQUksT0FBTyxDQUFDLFNBQWdCLEtBQUssS0FBSyxFQUFFO1lBQ3RDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNkO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lB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QUNqRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxhQUFJLG1CQUFNLElBQUksSUFBRSxXQUFXLEVBQUUsS0FBSyxJQUFHLENBQUMsQ0FBQztpQkFDakU7Z0JBQUMsT0FBTyxLQUFLLEVBQUU7b0JBQ2QsS0FBSyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7b0JBQzFCLE1BQU0sS0FBSyxDQUFDO2lCQUNiO2FBQ0Y7WUFFRCxNQUFNLEtBQUssQ0FBQztRQUNkLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ1UsaUJBQWlCOztZQUM1QixNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUU3RCxJQUFJO2dCQUVGLElBQUksS0FBSyxDQUFDLFdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUU7b0JBQ3ZDLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ2pELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDNUI7Z0JBQ0QsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFO29CQUNyQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxhQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUMxRTthQUVGO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsS0FBSyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7Z0JBQzFCLE1BQU0sS0FBSyxDQUFDO2FBQ2I7WUFFRCxNQUFNLEtBQUssQ0FBQztRQUNkLENBQUM7S0FBQTs7QUEvSmEsNkJBQXFCLEdBQUcsaUJBQWlCLENBQUM7QUFSMUQsMEJBd0tDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVXNlciB9IGZyb20gJy4uL21vZGVscyc7XG5pbXBvcnQgeyBIdHRwSW50ZXJjZXB0b3IsIEh0dHBPcHRpb25zIH0gZnJvbSAnLi4vYmFzZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBPYnNlcnZlciwgU3RvcmFnZVV0aWwgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBPQXV0aFdlYlNlcnZpY2UsIE9BdXRoV2ViU2VydmljZU9wdGlvbnMsIFVzZXJXZWJTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMnO1xuaW1wb3J0IHsgU2Vzc2lvbkNyZWRlbnRpYWxzSW50ZXJjZXB0b3IsIFNlc3Npb25VbmF1dGhvcml6ZWRJbnRlcmNlcHRvciB9IGZyb20gJy4vaW50ZXJjZXB0b3JzJztcbmltcG9ydCB7IExvY2FsU3RvcmFnZSB9IGZyb20gJy4uL3V0aWxzL3N0b3JhZ2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlc3Npb25PcHRpb25zIHtcbiAgaHR0cD86IEh0dHBPcHRpb25zO1xuICBhdXRvRmV0Y2g/OiBib29sZWFuO1xuICBzdG9yYWdlPzogU3RvcmFnZVV0aWw7XG4gIG9hdXRoPzogT0F1dGhXZWJTZXJ2aWNlT3B0aW9ucztcbiAgdXNlcldlYlNlcnZpY2U/OiBVc2VyV2ViU2VydmljZTtcbiAgb2F1dGhXZWJTZXJ2aWNlPzogT0F1dGhXZWJTZXJ2aWNlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXNzaW9uIHtcbiAgY3VycmVudD86IFVzZXI7XG4gIHN0b3JhZ2U6IFN0b3JhZ2VVdGlsO1xuICBvYnNlcnZhYmxlOiBPYnNlcnZhYmxlO1xuICB1c2VyV2ViU2VydmljZTogVXNlcldlYlNlcnZpY2U7XG4gIG9hdXRoV2ViU2VydmljZTogT0F1dGhXZWJTZXJ2aWNlO1xuICBfaW50ZXJjZXB0b3JzOiBIdHRwSW50ZXJjZXB0b3JbXSA9IFtdO1xuXG4gIHB1YmxpYyBzdGF0aWMgRVZFTlRfU0VTU0lPTl9DSEFOR0VEID0gJ1NFU1NJT05fQ0hBTkdFRCc7XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBpbnN0YW5jZTogU2Vzc2lvbjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgb3B0aW9uczogU2Vzc2lvbk9wdGlvbnMpIHtcbiAgICB0aGlzLm9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZSgpO1xuICAgIHRoaXMuc3RvcmFnZSA9IG9wdGlvbnMuc3RvcmFnZSB8fCBuZXcgU3RvcmFnZVV0aWwoJ3Nlc3Npb24nLCBuZXcgTG9jYWxTdG9yYWdlKHdpbmRvdykpO1xuXG4gICAgLy8gUHJlcGFyZSBzZXNzaW9uIGludGVyY2VwdG9yc1xuICAgIHRoaXMuX2ludGVyY2VwdG9ycyA9IFtcbiAgICAgIG5ldyBTZXNzaW9uQ3JlZGVudGlhbHNJbnRlcmNlcHRvcih0aGlzKSxcbiAgICAgIG5ldyBTZXNzaW9uVW5hdXRob3JpemVkSW50ZXJjZXB0b3IoKCkgPT4gdGhpcy5kZXN0cm95KCkpLFxuICAgIF07XG5cbiAgICAvLyBUT0RPOiBTZXJ2aWNlIGluc3RhbmNlIG9yIGNvbmZpZyBhcmUgcmVxdWlyZWQsIHZhbGlkYXRlIHRoaXNcbiAgICB0aGlzLm9hdXRoV2ViU2VydmljZSA9IG9wdGlvbnMub2F1dGhXZWJTZXJ2aWNlIHx8IE9BdXRoV2ViU2VydmljZS5nZXRJbnN0YW5jZSh7IC4uLm9wdGlvbnMub2F1dGggfSk7XG4gICAgdGhpcy51c2VyV2ViU2VydmljZSA9IG9wdGlvbnMudXNlcldlYlNlcnZpY2UgfHwgVXNlcldlYlNlcnZpY2UuZ2V0SW5zdGFuY2UoeyBzZXNzaW9uOiB0aGlzLCAuLi5vcHRpb25zLmh0dHAgfSk7XG5cbiAgICAvLyBGZXRjaCBzZXNzaW9uIGluIHN0YXJ0dXAgYnkgZGVmYXVsdFxuICAgIGlmIChvcHRpb25zLmF1dG9GZXRjaCBhcyBhbnkgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmZldGNoKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHNlc2lzb24gaW50ZXJjZXB0b3JzIGZvciBhdXRob3JpemVkIGNhbGxzIGFuZCBhdXRvIHNlc3Npb24gZGVzdHJ1Y3Rpb24uXG4gICAqL1xuICBpbnRlcmNlcHRvcnMoKTogSHR0cEludGVyY2VwdG9yW10ge1xuICAgIHJldHVybiB0aGlzLl9pbnRlcmNlcHRvcnM7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBzZXNzaW9uIHNpbmdsZXRvbiBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgVGhlIHNlc3Npb24gb3B0aW9uc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZShvcHRpb25zOiBTZXNzaW9uT3B0aW9ucyk6IFNlc3Npb24ge1xuICAgIGlmICghdGhpcy5pbnN0YW5jZSkge1xuICAgICAgdGhpcy5pbnN0YW5jZSA9IG5ldyBTZXNzaW9uKG9wdGlvbnMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmUgZm9yIHVwZGF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JzZXJ2ZXJ9IG9ic2VydmFibGUgVGhlIGluc3RhY2UgdG8gYmUgbm90aWZpZWRcbiAgICovXG4gIHB1YmxpYyBzdWJzY3JpYmUob2JzZXJ2YWJsZTogT2JzZXJ2ZXIpIHtcbiAgICB0aGlzLm9ic2VydmFibGUuc3Vic2NyaWJlKG9ic2VydmFibGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVuc3Vic2NyaWJlIGZyb20gdXBkYXRlcy5cbiAgICpcbiAgICogQHBhcmFtIHtPYnNlcnZlcn0gb2JzZXJ2YWJsZSBUaGUgaW5zdGFuY2UgdG8gYmUgcmVtb3ZlZCBmcm9tIGxpc3RlbmVyc1xuICAgKi9cbiAgcHVibGljIHVuc3Vic2NyaWJlKG9ic2VydmFibGU6IE9ic2VydmVyKSB7XG4gICAgdGhpcy5vYnNlcnZhYmxlLnVuc3Vic2NyaWJlKG9ic2VydmFibGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIG5ldyB1c2VyIGluIHNlc3Npb24sIG5vdGlmeWluZyBhbGwgb2JzZXJ2ZXJzLlxuICAgKlxuICAgKiBAcGFyYW0gdXNlciBUaGUgdXNlciBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge3tub3RpZnk6IGJvb2xlYW59fSBvcHRpb25zIFRoZSBvcGVyYXRpb24gb3B0aW9uc1xuICAgKi9cbiAgcHVibGljIGFzeW5jIHJlZ2lzdGVyKHVzZXI6IFVzZXIsIG9wdGlvbnMgPSB7IG5vdGlmeTogdHJ1ZSB9KSB7XG4gICAgdGhpcy5jdXJyZW50ID0gdXNlcjtcblxuICAgIC8vIFNhdmUgaW4gbG9jYWwgc3RvcmFnZVxuICAgIGF3YWl0IHRoaXMuc3RvcmFnZS5wdXQoJ3Nlc3Npb24nLCB0aGlzLmN1cnJlbnQpO1xuXG4gICAgLy8gQXQgbGFzdCwgbm90aWZ5IG9ic2VydmVycyBvZiB0aGlzIGNoYW5nZVxuICAgIGlmICghb3B0aW9ucyB8fCAob3B0aW9ucyAmJiBvcHRpb25zLm5vdGlmeSkpIHtcbiAgICAgIGF3YWl0IHRoaXMub2JzZXJ2YWJsZS5ub3RpZnkoU2Vzc2lvbi5FVkVOVF9TRVNTSU9OX0NIQU5HRUQsIHRoaXMuY3VycmVudCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmN1cnJlbnQ7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2hlcyB0aGUgY3VycmVudGx5IHN0b3JlZCBzZXNzaW9uLlxuICAgKi9cbiAgcHJvdGVjdGVkIGFzeW5jIGZldGNoKCkge1xuICAgIHRoaXMuY3VycmVudCA9IGF3YWl0IHRoaXMuc3RvcmFnZS5nZXQoJ3Nlc3Npb24nKTtcblxuICAgIGF3YWl0IHRoaXMub2JzZXJ2YWJsZS5ub3RpZnkoU2Vzc2lvbi5FVkVOVF9TRVNTSU9OX0NIQU5HRUQsIHRoaXMuY3VycmVudCk7XG5cbiAgICByZXR1cm4gdGhpcy5jdXJyZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIHRoZSBzZXNzaW9uIGFuZCBjbGVhcnMgdGhlIHN0b3JhZ2UuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZGVzdHJveSgpIHtcbiAgICB0aGlzLmN1cnJlbnQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBEZXN0cm95cyBpbiBsb2NhbCBzdG9yYWdlXG4gICAgYXdhaXQgdGhpcy5zdG9yYWdlLmNsZWFyKCk7XG5cbiAgICAvLyBBdCBsYXN0LCBub3RpZnkgb2JzZXJ2ZXJzIG9mIHRoaXMgY2hhbmdlXG4gICAgYXdhaXQgdGhpcy5vYnNlcnZhYmxlLm5vdGlmeShTZXNzaW9uLkVWRU5UX1NFU1NJT05fQ0hBTkdFRCwgdGhpcy5jdXJyZW50KTtcblxuICAgIGlmICh0aGlzLmN1cnJlbnQpIHtcbiAgICAgIC8vIFJldm9rZXMgdGhlIHRva2VuIGluIHRoZSBPQXV0aCBTZXJ2ZXJcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHRoaXMub2F1dGhXZWJTZXJ2aWNlLnJldm9rZSh0aGlzLmN1cnJlbnQuY3JlZGVudGlhbHMuYWNjZXNzVG9rZW4pO1xuICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignU0VTU0lPTjogQ291bGQgbm90IGRlc3Ryb3kgY3VycmVudCBzZXNzaW9uJywgZXhjZXB0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jdXJyZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGEgXCJwYXNzd29yZFwiIGF1dGhlbnRpY2F0aW9uIHVzaW5nIHRoZSBPQXV0aCAyLjAgc2VydmVyIGFuZCByZWdpc3RlcnMgaXQgaW4gY3VycmVudCBzZXNzaW9uLlxuICAgKlxuICAgKiBAcGFyYW0gZGF0YSBUaGUgdXNlciBjcmVkZW50aWFsc1xuICAgKi9cbiAgcHVibGljIGFzeW5jIHBhc3N3b3JkKGRhdGE6IHsgdXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyB9KTogUHJvbWlzZTxVc2VyPiB7XG4gICAgY29uc3Qgb2F1dGggPSBhd2FpdCB0aGlzLm9hdXRoV2ViU2VydmljZS5wYXNzd29yZChkYXRhKTtcblxuICAgIGlmIChvYXV0aC5hY2Nlc3NUb2tlbikge1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgdGhpcy51c2VyV2ViU2VydmljZS5tZShvYXV0aCk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlZ2lzdGVyKG5ldyBVc2VyKHsgLi4udXNlciwgY3JlZGVudGlhbHM6IG9hdXRoIH0pKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGVycm9yLmNyZWRlbnRpYWxzID0gb2F1dGg7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRocm93IG9hdXRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGEgXCJjbGllbnRfY3JlZGVudGlhbHNcIiBhdXRoZW50aWNhdGlvbiB1c2luZyB0aGUgT0F1dGggMi4wIHNlcnZlciBhbmQgcmVnaXN0ZXJzIGl0IGluIGN1cnJlbnQgc2Vzc2lvbi5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBjbGllbnRDcmVkZW50aWFscygpOiBQcm9taXNlPFVzZXI+IHtcbiAgICBjb25zdCBvYXV0aCA9IGF3YWl0IHRoaXMub2F1dGhXZWJTZXJ2aWNlLmNsaWVudENyZWRlbnRpYWxzKCk7XG5cbiAgICB0cnkge1xuXG4gICAgICBpZiAob2F1dGguYWNjZXNzVG9rZW4gJiYgIW9hdXRoLnZpcnR1YWwpIHtcbiAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IHRoaXMudXNlcldlYlNlcnZpY2UubWUob2F1dGgpO1xuICAgICAgICByZXR1cm4gdGhpcy5yZWdpc3Rlcih1c2VyKTtcbiAgICAgIH1cbiAgICAgIGlmIChvYXV0aC5hY2Nlc3NUb2tlbikge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWdpc3RlcihuZXcgVXNlcih7IGlkOiBvYXV0aC51c2VySWQsIGNyZWRlbnRpYWxzOiBvYXV0aCB9KSk7XG4gICAgICB9XG5cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZXJyb3IuY3JlZGVudGlhbHMgPSBvYXV0aDtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cblxuICAgIHRocm93IG9hdXRoO1xuICB9XG59XG4iXX0=