// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Port 4322 is reserved for the Dark Portfolio project.
	// 4321 belongs to the separate Mix Media portfolio — do not use it here.
	server: {
		port: 4322,
	},
});
