// Import default WordPress components
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

// Custom components
import FormSelector from './components/FormSelector';

export default registerBlockType( 'wpjsio/gravity-forms', {

	title: __( 'Gravity Forms' ),
	description: __( 'A simple way to embed a Gravity Forms on your page.' ),
	icon: 'feedback',
	category: 'common',
	keywords: [
		__( 'Gravity Forms' ),
		__( 'Forms' ),
		__( 'gf' ),
	],
	attributes: {
		formID: {
			type: 'number',
			default: 0,
		},
		formTitle: {
			type: 'boolean',
			default: false,
		},
		formDescription: {
			type: 'boolean',
			default: false,
		},
		useAjax: {
			type: 'boolean',
			default: false,
		},
		formTabIndex: {
			type: 'number',
		},
		fieldValues: {
			type: 'string',
		},
	},
	supports: {
		html: false,
	},
	edit: FormSelector,
	save() {
		return null;
	},
} );
