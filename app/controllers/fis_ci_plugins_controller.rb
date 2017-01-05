class FisCiPluginsController < ApplicationController
  before_action :logged_in_user, only: [:index, :create, :new, :show, :edit, :update, :destroy]
  before_action :set_fis_ci_plugin, only: [:show, :edit, :update, :destroy]

  # GET /fis_ci_plugins
  # GET /fis_ci_plugins.json
  def index
    # @fis_ci_plugins = FisCiPlugin.select('content').paginate(page: params[:page], :per_page => 15)
    @fis_ci_plugins = FisCiPlugin.paginate(page: params[:page], :per_page => 15).order("created_at DESC")
  end

  # GET /fis_ci_plugins/1
  # GET /fis_ci_plugins/1.json
  def show
  end

  # GET /fis_ci_plugins/new
  def new
    @fis_ci_plugins = []
    @fis_ci_plugins << FisCiPlugin.new
  end

  # GET /fis_ci_plugins/1/edit
  def edit
  end

  # POST /fis_ci_plugins
  # POST /fis_ci_plugins.json
  def create
    # puts ActiveSupport::JSON.decode(fis_ci_plugin_params)
    @fis_ci_plugins = []
    params["fis_ci_plugins"].each do |fis_ci_plugin|
      if fis_ci_plugin["input"] != ""
        @fis_ci_plugins << current_user.fis_ci_plugins.build(fis_ci_plugin_params(fis_ci_plugin))
      end
    end

    # @fis_ci_plugin = current_user.fis_ci_plugins.build(fis_ci_plugin_params)
    # FisCiPlugin.create!(@fis_ci_plugins)

    respond_to do |format|

      begin
        # FisCiPlugin.import @fis_ci_plugins
        @fis_ci_plugins.map {|fis_ci_plugin| fis_ci_plugin.save } 
        format.html { redirect_to fis_ci_plugins_path, notice: 'Fis ci plugin was successfully created.' }
      rescue => ex
        logger.error ex.message
        format.html { render :new }
      end
      
    end
    
    # respond_to do |format|
    #   if @fis_ci_plugins.save
    #     @fis_ci_plugins.download_rename_publish_npm_package
    #     format.html { redirect_to @fis_ci_plugins, notice: 'Fis ci plugin was successfully created.' }
    #     format.json { render :show, status: :created, location: @fis_ci_plugins }
    #   else
    #     format.html { render :new }
    #     format.json { render json: @fis_ci_plugins.errors, status: :unprocessable_entity }
    #   end
    # end
  end

  # PATCH/PUT /fis_ci_plugins/1
  # PATCH/PUT /fis_ci_plugins/1.json
  def update
    respond_to do |format|
      if @fis_ci_plugin.update(fis_ci_plugin_params)
        format.html { redirect_to @fis_ci_plugin, notice: 'Fis ci plugin was successfully updated.' }
        format.json { render :show, status: :ok, location: @fis_ci_plugin }
      else
        format.html { render :edit }
        format.json { render json: @fis_ci_plugin.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /fis_ci_plugins/1
  # DELETE /fis_ci_plugins/1.json
  def destroy
    @fis_ci_plugin.destroy
    respond_to do |format|
      format.html { redirect_to fis_ci_plugins_url, notice: 'Fis ci plugin was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def update_npm_package_bin

  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_fis_ci_plugin
      @fis_ci_plugin = FisCiPlugin.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def fis_ci_plugin_params
      # params.require(:fis_ci_plugin).permit(:content)
      params.require(:fis_ci_plugin).permit(:log, :bin, :status, :input, :packageName, :packageVersion, :ciPackageName, :ciPackageNamePrefix)
    end

    def fis_ci_plugin_params(param)
      # params.require(:fis_ci_plugin).permit(:content)
      param.permit(:log, :bin, :status, :input, :packageName, :packageVersion, :ciPackageName, :ciPackageNamePrefix)
    end
end
