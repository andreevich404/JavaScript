'use strict';

class ApiService {
	constructor({ baseUrl }) {
		this.baseUrl = baseUrl;
	}

	async fetchJson(pathOrUrl, options = {}) {
		const timeoutMs = typeof options.timeoutMs === 'number' ? options.timeoutMs : 90000;
		const url = String(pathOrUrl || '').startsWith('http')
			? String(pathOrUrl)
			: `${this.baseUrl}${pathOrUrl}`;
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
		let res;
		try {
			res = await fetch(url, {
				headers: {
					accept: 'application/json',
				},
				signal: controller.signal,
			});
		}
		catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			throw new Error(`Network error @ ${url}: ${message}`);
		}
		finally {
			clearTimeout(timeoutId);
		}

		if (!res.ok) {
			let body = '';
			try {
				body = await res.text();
			}
			catch {
				body = '';
			}

			const suffix = body ? ` — ${body.slice(0, 140)}` : '';
			throw new Error(`HTTP ${res.status} ${res.statusText} @ ${url}${suffix}`);
		}

		return res.json();
	}
}

export { ApiService };
