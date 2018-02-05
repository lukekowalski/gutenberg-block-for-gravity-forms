const { __ } = wp.i18n;
const { Placeholder, PanelBody } = wp.components;
const { InspectorControls } = wp.blocks;
const { TextControl, SelectControl, ToggleControl } = InspectorControls;

const FormSelector = ( props ) => {
	const { focus, attributes, setAttributes, className } = props;
	const { formID, formTitle, formDescription, formTabIndex, useAjax, fieldValues } = attributes;
	const { gravityformsWebapiResponse } = gfgbGlobals;
	const options = [
		{ value: 0, label: __( 'Select Form' ) },
	];

	const isObjectEmpty = ( obj ) => {
		for ( const key in obj ) {
			if ( obj.hasOwnProperty( key ) ) {
				return false;
			}
		}
		return true;
	};

	// If an error occured on getting the forms from GF Web API
	// return the error content to the user
	if ( gravityformsWebapiResponse.hasOwnProperty( 'error' ) ) {
		return (
			<Placeholder
				key="gravity-forms-block"
				icon="email"
				label={ gravityformsWebapiResponse.details }
				className={ className }
			>
			</Placeholder>
		);
	}

	// Current Gravity Forms Web API returns an object of objects
	if ( gravityformsWebapiResponse && ! isObjectEmpty( gravityformsWebapiResponse ) ) {
		Object.keys( gravityformsWebapiResponse ).forEach( key => {
			const { id, title } = gravityformsWebapiResponse[ key ];
			options.push( { value: id, label: title } );
		} );
	}

	return (
		<Placeholder
			key="gravity-forms-block"
			icon="email"
			label={ __( 'Gravity Forms Block' ) }
			className={ className }
		>

			<SelectControl
				label={ __( 'Contact Form' ) }
				value={ formID || 'none' }
				onChange={ newFormID => setAttributes( { formID: newFormID } ) }
				options={ options }
			/>

			{
				( formID !== 0 && focus ) ?
					<InspectorControls key="gravityforms-inspector">

						<h3>{ __( 'Basic settings' ) }</h3>

						{ /* Form title */ }
						<ToggleControl
							label={ __( 'Show form title' ) }
							checked={ !! formTitle }
							onChange={ () => setAttributes( { formTitle: ! formTitle } ) }
						/>

						{ /* Form description */ }
						<ToggleControl
							label={ __( 'Show form description' ) }
							checked={ !! formDescription }
							onChange={ () => setAttributes( { formDescription: ! formDescription } ) }
						/>

						{ /* Use Ajax */ }
						<ToggleControl
							label={ __( 'Use Ajax for Forms' ) }
							checked={ !! useAjax }
							onChange={ () => setAttributes( { useAjax: ! useAjax } ) }
						/>

						<PanelBody title={ __( 'Advanced settings' ) } initialOpen={ false }>
							<TextControl
								label={ __( 'Tabindex' ) }
								value={ formTabIndex }
								type={ 'number' }
								onChange={ ( e ) => {
									setAttributes( { formTabIndex: e } );
								} }
							/>
							<p>{ __( 'Specify the starting tab index for the fields of this form.' ) }</p>

							<TextControl
								label={ __( 'Field values' ) }
								value={ fieldValues }
								onChange={ ( e ) => {
									setAttributes( { fieldValues: e } );
								} }
							/>
							<p>{ __( 'Specify the default field values. Example: ’check=First Choice,Second Choice’.' ) }</p>
						</PanelBody>

					</InspectorControls> :
					null
			}

		</Placeholder>
	);
};

export default FormSelector;
